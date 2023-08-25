import {Router} from "express"
import TempiAPI from "../tempi_api"

export default class SensorRouter {
	static route: string = "/sensor"
	private readonly router: Router

	constructor(api: TempiAPI) {
		this.router = Router()

		this.router.get("/new", async (req, res) => {
			res.json(await api.database.getNewSensors())
		})

		this.router.put("/known", async (req, res) => {
			if (
				!["uuid", "name"].every((val) =>
					Object.keys(req.body).includes(val)
				)
			) {
				res.json({error: "Not all parameter fulfilled."})
				return
			}
			if (req.body.name === "") {
				res.json({error: "The Name can not be blank."})
				return
			}
			if (req.body.name.length > 20) {
				res.json({error: "Name is to long max 20 chars."})
				return
			}
			if (!(await api.database.checkUUID(req.body.uuid))) {
				res.json({error: "UUID is not valide."})
				return
			}
			await api.database.setName(req.body.uuid, req.body.name)
			res.json({success: "Changed Name."})
		})

		this.router.get("/known", async (req, res) => {
			res.json(await api.database.getConnectedSensors())
		})

		this.router.get("/:uuid", async (req, res) => {
			res.json(await api.database.getSingleSensorData(req.params.uuid))
		})

		this.router.get("/:uuid/settings", async (req, res) => {
			const sensor = api.mqtt
				.getSensors()
				.find((s) => s.uuid == req.params.uuid)
			if (sensor) {
				res.json(sensor.settings)
			} else {
				res.sendStatus(404)
			}
		})

		this.router.get("/:uuid/:label", async (req, res) => {
			const rawData = await api.database.getSensorData(
				req.params.uuid,
				req.params.label
			)
			res.json(
				rawData.map((rawDataObject) => {
					rawDataObject.value = rawDataObject.value.toString()
					return rawDataObject
				})
			)
		})
	}

	get() {
		return this.router
	}
}
