import MqttClient, {Sensor} from "./mqtt_client"
import DataBase from "../db/db_connection"
import RealtimeRouter from "../api/routes/realtime"
import {Logger} from "../utils/logger"

export default class MqttDataWorker {
	private mqtt: MqttClient
	private database: DataBase

	constructor(mqtt: MqttClient, database: DataBase) {
		this.mqtt = mqtt
		this.database = database

		mqtt.on("newSensor", (sensor: Sensor) => {
			Logger.info("New Sensor:", sensor.toString())
			database.sensor.connect(sensor).then((value) => {
				if (value) {
					if (value === "new") {
						RealtimeRouter.events.emit("send", "new", sensor.uuid)
					} else {
						RealtimeRouter.events.emit("send", "connect", sensor.toObject(value))
					}
				}
			})

			sensor.on("message", (topic: string, messageLabel: string, message: Buffer) => {
				database.sensor_data.add(sensor, messageLabel, message)
				RealtimeRouter.events.emit("send", sensor.uuid, {
					[messageLabel]: message.toString()
				})
			})

			sensor.on("alive", () => {
				Logger.debug("Sensor Alive", sensor.uuid)
				database.sensor.alive(sensor)
			})
		})

		mqtt.on("removeSensor", (sensor: Sensor) => {
			database.sensor.dead(sensor)
			Logger.info("Sensor Dead", sensor.uuid)
			RealtimeRouter.events.emit("send", "disconnect", sensor.uuid)
		})
	}

	getSensors() {
		return this.mqtt.getSensors()
	}
}
