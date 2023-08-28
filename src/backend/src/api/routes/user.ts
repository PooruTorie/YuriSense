import {Router} from "express"
import YurisenseAPI from "../yurisense_api"

export default class UserRouter {
	static route: string = "/user"
	private readonly router: Router

	constructor(api: YurisenseAPI) {
		this.router = Router()

		this.router.post("/signup", async (req, res) => {
			const {username, password, isAdmin} = req.body
			if (!username || !password || !isAdmin) {
				return res.sendStatus(400)
			}

			if (typeof isAdmin != "boolean") {
				return res.status(400).json({error: "isAdmin is not type boolean"})
			}

			await api.database
				.createUser(username, password, isAdmin)
				.then((result) => {
					console.log("User created:", result)
					res.status(200).json({
						message: "User created:" + result
					})
				})
				.catch((error) => {
					console.error("Error:", error)
				})
		})
	}

	get() {
		return this.router
	}
}
