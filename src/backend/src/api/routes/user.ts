import {Router} from "express"
import AuthMiddleware from "../../middleware/auth"
const argon2 = require("argon2")
import YurisenseAPI from "../yurisense_api"

export default class UserRouter {
	static route: string = "/user"
	private readonly router: Router

	constructor(api: YurisenseAPI) {
		this.router = Router()
		this.router.post("/signup", async (req, res) => {
			const {username, email, password, admin, firstName, lastName, phone} = req.body
			if (!username || !password || !email || !admin || !firstName || !lastName || !phone) {
				res.json({error: "Not all parameter fulfilled."})
				return
			}

			let emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
			if (!emailRegex.test(email)) {
				res.json({
					error: "Email address provided is not valid"
				})
			}

			const user = await api.database.getUserByEmail(email)
			if (user) {
				return res.json({
					error: "User with this email address already exists"
				})
			}

			await api.database
				.createUser(username, email, password, admin, firstName, lastName, phone)
				.then((id) => {
					res.json({message: "User created", userId: id})
				})
				.catch((error) => {
					console.error("Error:", error)
					res.json({error: "Caught error on user creation"})
				})
		})

		this.router.post("/signin", async (req, res) => {
			const {email, password} = req.body
			if (!email || !password) {
				return res.json({error: "All input is required"})
			}

			const user = await api.database.getUserByEmail(email)
			if (user === null) {
				return res.json({error: "User not found"})
			}

			if (!(await argon2.verify(user?.password, password))) {
				return res.json({error: "Email & password combo was wrong"})
			}
			const userData = {
				userId: user?.id,
				username: user?.username,
				email: email,
				admin: user?.admin
			}
			const token = api.auth.createToken(userData, "8h")
			if (!token) {
				return res.json({error: "Token Could not be Generated"})
			}
			return res.json({
				yuriToken: token
			}) // expires in 8h after creation
		})

		this.router.post("/signout", api.auth.authenticateToken, async (req, res) => {
			if (req.user) {
				api.auth.revokeToken(req.user)
				return res.json({
					message: `Token from ${req.user.username} has been revoked`
				})
			} else {
				return res.json({error: "Invalid token"})
			}
		})
	}

	get() {
		return this.router
	}
}
