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
			database.connectNewSensor(sensor).then((value) => {
				if (value) {
					if (value === "new") {
						RealtimeRouter.events.emit("send", "new", sensor.uuid)
					} else {
						RealtimeRouter.events.emit(
							"send",
							"connect",
							sensor.toObject(value)
						)
					}
				}
			})

			sensor.on(
				"message",
				(topic: string, messageLabel: string, message: Buffer) => {
					database.collectSensorData(sensor, messageLabel, message)
					RealtimeRouter.events.emit("send", sensor.uuid, {
						[messageLabel]: message.toString()
					})
				}
			)

			sensor.on("alive", () => {
				Logger.debug("Sensor Alive", sensor.uuid)
				database.sensorAlive(sensor)
			})
		})

		mqtt.on("removeSensor", (sensor: Sensor) => {
			database.sensorDead(sensor)
			Logger.info("Sensor Dead", sensor.uuid)
			RealtimeRouter.events.emit("send", "disconnect", sensor.uuid)
		})
	}

	getSensors() {
		return this.mqtt.getSensors()
	}
}
