import * as dotenv from "dotenv"
import MqttClient from "./mqtt/mqtt_client"
import YurisenseAPI from "./api/yurisense_api"
import DataBase from "./db/db_connection"
import MqttDataWorker from "./mqtt/mqtt_dataworker"
import {AddressExtractor} from "./utils/address_extractor"
import {Logger} from "./utils/logger"
import onExit from "async-exit-hook"

dotenv.config()
Logger.createLogger(process.env.LEVEL ?? "info")

if (AddressExtractor.extract()) {
	process.on("uncaughtException", function (err) {
		Logger.error("Caught exception:", err)
	})

	const mqtt = new MqttClient("mqtt://127.0.0.1")
	const database = new DataBase("mysql://yuri@127.0.0.1", "yurisense")
	const dataWorker = new MqttDataWorker(mqtt, database)
	const api = new YurisenseAPI(3000, database, dataWorker, 12666)
	api.serve()
	database.allSensorsDead()

	onExit((resolve) =>
		database.allSensorsDead().finally(() => {
			Logger.info("Stopped")
			resolve()
		})
	)
} else {
	Logger.error("Error on Address Extraction")
}
