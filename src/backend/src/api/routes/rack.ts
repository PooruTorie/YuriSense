import {Router} from "express"
import * as argon2 from "argon2"
import YurisenseAPI from "../yurisense_api"

export default class RackRouter {
	static route: string = "/rack"
	private readonly router: Router

	constructor(api: YurisenseAPI) {
		this.router = Router()
		this.router.post("/", api.auth.authenticateToken, async (req, res) => {
			if (!req.user) {
				return res.json({error: "token_invalide"})
			}

			const {name} = req.body
			if (!name) {
				res.json({error: "parameter_missing"})
				return
			}

			await api.database.rack
				.create(name)
				.then((id) => {
					res.json({message: "Rack created", rackId: id})
				})
				.catch((error) => {
					console.error("Error:", error)
					res.json({error: "internal_error"})
				})
		})
		this.router.get("/", async (req, res) => {
			res.json(await api.database.rack.get())
		})

		this.router.post("/:id/", api.auth.authenticateToken, async (req, res) => {
			if (!req.user) {
				return res.json({error: "token_invalide"})
			}

			const {name, maxTemperature} = req.body
			if (!name || typeof maxTemperature == "undefined") {
				res.json({error: "parameter_missing"})
				return
			}

			const id = parseInt(req.params.id)
			const rack = await api.database.rack.getById(id)

			if (!rack) {
				return res.json({error: "rack_not_found"})
			}

			const oldValue = rack.maximalTemperature
			const maxTemperatureValue = maxTemperature == "" ? null : parseInt(maxTemperature)

			if (oldValue !== maxTemperatureValue) {
				await api.database.log.add(id, req.user.userId, oldValue)
			}
			await api.database.rack.update(id, name, maxTemperatureValue)
			res.json({success: true})
		})
	}

	get() {
		return this.router
	}
}
