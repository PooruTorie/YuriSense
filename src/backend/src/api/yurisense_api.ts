// @ts-ignore
import express, {Express} from "express"
import DataBase from "../db/db_connection"

import SensorRouter from "./routes/sensor"
import SensorDiscovery from "../discovery/sensor_discovery"
import * as bodyParser from "body-parser"
import RealtimeRouter from "./routes/realtime"
import {Logger} from "../utils/logger"
import * as log4js from "log4js"
import MqttDataWorker from "../mqtt/mqtt_dataworker"
import UpdatesRouter from "./routes/updates"
import UserRouter from "./routes/user"
import AuthMiddleware from "../middleware/auth"
import RackRouter from "./routes/rack"
import RackQuery from "../db/db_rack_querys"

export default class YurisenseAPI {
	public database: DataBase
	public mqtt: MqttDataWorker
	private app: Express
	private readonly port: number
	public readonly auth: AuthMiddleware

	constructor(port: number, database: DataBase, mqtt: MqttDataWorker, discoveryPort: number) {
		this.app = express()
		this.port = port
		this.database = database
		this.mqtt = mqtt
		this.auth = new AuthMiddleware()

		// parse application/x-www-form-urlencoded
		this.app.use(bodyParser.urlencoded({extended: false}))

		// parse application/json
		this.app.use(bodyParser.json())

		// add logger
		this.app.use(log4js.connectLogger(log4js.getLogger("api"), {level: "debug"}))

		SensorDiscovery.setup(discoveryPort)

		this.app.get("/api/discover", async (req, res) => {
			res.json(SensorDiscovery.startDiscovery(discoveryPort))
		})
		this.app.use("/api" + SensorRouter.route, new SensorRouter(this).get())
		this.app.use("/api" + RealtimeRouter.route, new RealtimeRouter(this).get())
		this.app.use("/api" + UpdatesRouter.route, new UpdatesRouter(this).get())
		this.app.use("/api" + UserRouter.route, new UserRouter(this).get())
		this.app.use("/api" + RackRouter.route, new RackRouter(this).get())
	}

	serve() {
		this.app.listen(this.port, () => {
			Logger.info("Backend running on port: " + this.port)
		})
	}
}
