import {Router} from "express"
import * as argon2 from "argon2"
import YurisenseAPI from "../yurisense_api"

export default class UserRouter {
	static route: string = "/user"
	private readonly router: Router

	constructor(api: YurisenseAPI) {
		this.router = Router()
		this.router.get("/", api.auth.authenticateToken, async (req, res) => {
			if (!req.user) {
				return res.json({error: "token_invalide"})
			}

			if (!req.user.admin) {
				return res.json({error: "no_permission"})
			}

			res.json(await api.database.user.get())
		})

		this.router.post("/:id/", api.auth.authenticateToken, async (req, res) => {
			if (!req.user) {
				return res.json({error: "token_invalide"})
			}

			if (!req.user.admin) {
				return res.json({error: "no_permission"})
			}

			const {email, password, firstName, lastName, phone, admin} = req.body
			if (!email || !firstName || !lastName || !phone || typeof admin == "undefined") {
				res.json({error: "parameter_missing"})
				return
			}

			const id = parseInt(req.params.id)
			const user = await api.database.user.getById(id)

			if (!user) {
				return res.json({error: "user_not_found"})
			}

			await api.database.user.update(id, firstName, lastName, password, email, phone, admin)
			res.json({success: true})
		})

		this.router.delete("/:id/", api.auth.authenticateToken, async (req, res) => {
			if (!req.user) {
				return res.json({error: "token_invalide"})
			}

			if (!req.user.admin) {
				return res.json({error: "no_permission"})
			}

			const id = parseInt(req.params.id)
			const user = await api.database.user.getById(id)

			if (!user) {
				return res.json({error: "user_not_found"})
			}

			await api.database.user.delete(id)
			res.json({success: true})
		})
	}

	get() {
		return this.router
	}
}
