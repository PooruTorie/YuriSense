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
	}

	get() {
		return this.router
	}
}
