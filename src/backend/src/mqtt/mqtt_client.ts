import * as mqtt from "mqtt"
import {EventEmitter} from "events"
import axios from "axios"
import {Logger} from "../utils/logger"
import {clearInterval} from "timers"

export default class MqttClient extends EventEmitter {
	private connection: mqtt.MqttClient
	private sensors: Sensor[] = []

	constructor(host: string) {
		super()
		this.setMaxListeners(50)
		this.connection = mqtt.connect(host, {
			port: 1883,
			clientId: "yurisense-backend"
		})
		this.connection.on("error", (error) => {
			Logger.fatal("Can't connect" + error)
		})
		this.connection.on("connect", () => {
			this.connection.subscribe("yurisense/device")
			this.connection.on("message", (topic, message) => {
				Logger.debug("MQTT Message", topic, message)
				if (topic === "yurisense/device") {
					this.registerNewSensor(JSON.parse(message.toString()))
					return
				}
				this.emit("message", topic, message)
			})
		})
	}

	public getSensors(): Sensor[] {
		return this.sensors
	}

	subscribe(topic: string) {
		this.connection.subscribe(topic)
	}

	unsubscribe(topic: string) {
		this.connection.unsubscribe(topic)
	}

	private registerNewSensor(data: {uuid: string; ip: string}) {
		if (!this.sensors.find((sensor) => sensor.uuid == data.uuid)) {
			const sensor = new Sensor(this, data.uuid, data.ip, () => {
				this.emit("newSensor", sensor)
			})
			this.sensors.push(sensor)
			sensor.on("disconnect", () => {
				this.sensors = this.sensors.filter((s) => s.uuid !== sensor.uuid)
				this.emit("removeSensor", sensor)
			})
		}
	}
}

export class Sensor extends EventEmitter {
	settings = {}
	private connection: MqttClient
	private readonly _topic: string
	private readonly _uuid: string
	private _version: string = "x.x.x"
	private _alive: number = 10
	private readonly _aliveInterval: ReturnType<typeof setInterval>

	constructor(connection: MqttClient, uuid: string, ip: string, initCallback: Function) {
		super()
		this.setMaxListeners(50)
		this.connection = connection
		this._topic = "yurisense/sensor/" + uuid
		this._uuid = uuid
		this._ip = ip

		connection.subscribe(this._topic + "/#")
		connection.on("message", (topic, message) => {
			if (topic.startsWith(this._topic)) {
				const messageLabel = topic.replace(this._topic + "/", "")
				if (messageLabel === "keepalive") {
					this.alive(message.toString())
				} else {
					this.emit("message", topic, messageLabel, message)
				}
			}
		})
		Promise.all([this.requestConfiguration(), this.requestSettings()]).then(() => initCallback())

		this._aliveInterval = setInterval(() => {
			if (this._alive < 0) {
				this.kill()
			}
			this._alive--
		}, 1000)
	}

	private _ip: string

	get ip(): string {
		return this._ip
	}

	private _type: string = "not_detected"

	get type(): string {
		return this._type
	}

	get uuid(): string {
		return this._uuid
	}

	get firmwareVersion(): string {
		return this._version
	}

	toString() {
		return (
			"Sensor {" +
			"ip: " +
			this._ip +
			", uuid: " +
			this._uuid +
			", type: " +
			this._type +
			", version: " +
			this._version +
			"}"
		)
	}

	alive(ip: string) {
		this._ip = ip
		this._alive = 20
		this.emit("alive")
	}

	toObject(name: string) {
		return {
			uuid: this.uuid,
			type: this.type,
			version: this.firmwareVersion,
			ip: this.ip,
			name
		}
	}

	public kill() {
		clearInterval(this._aliveInterval)
		this.connection.unsubscribe(this._topic + "/#")
		this.emit("disconnect")
	}

	private async requestConfiguration() {
		try {
			const res = await axios.get("http://" + this._ip + "/")
			if (res.status == 200) {
				if (res.data.version) {
					this._version = res.data.version
				}
				if (res.data.type) {
					this._type = res.data.type
				}
				Logger.debug("Request Configuration", this.toString())
			}
		} catch (e) {
			Logger.error("Catch error from Sensor Configuration", e)
			return this.requestConfiguration()
		}
	}

	private async requestSettings() {
		try {
			const res = await axios.get("http://" + this._ip + "/settings")
			if (res.status == 200) {
				if (res.data) {
					this.settings = res.data
				}
				Logger.debug("Request Settings", this.settings)
			}
		} catch (e) {
			Logger.error("Catch error from Sensor Settings", e)
			return this.requestSettings()
		}
	}
}
