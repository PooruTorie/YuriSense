import {default as EspOTA} from "esp-ota"
import * as fs from "fs"
import RealtimeRouter from "../api/routes/realtime"
import {Sensor} from "../mqtt/mqtt_client"

export default class SensorUpdater {
	public static async update(sensor: Sensor) {
		const config = JSON.parse(
			fs.readFileSync("updates/config.json", {encoding: "utf8"})
		)

		const esp = new EspOTA()

		esp.on("state", (state) =>
			RealtimeRouter.events.emit("send", "update_state", {state})
		)
		esp.on("progress", (current, total) =>
			RealtimeRouter.events.emit("send", "update_progress", {current, total})
		)

		esp.setPassword(config["ota_password"])

		await esp.uploadFirmware(
			"updates/" + config.types[sensor.type].file,
			sensor.ip,
			3232
		)
		sensor.kill()
	}
}
