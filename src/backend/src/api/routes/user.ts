import {Router} from "express"
import AuthMiddleware from "../../middleware/auth"
const argon2 = require("argon2")
import YurisenseAPI from "../yurisense_api"


export default class UserRouter {
	static route: string = "/user"
	private revokedTokens: Set<string> = new Set()
	private readonly router: Router
	private readonly auth: AuthMiddleware

	constructor(api: YurisenseAPI) {
		this.router = Router()
		this.auth = new AuthMiddleware()
		this.router.post("/signup", async (req, res) => {
			const {username, email, password, admin} = req.body
			if (!username || !password || !email || !admin) {
				return res.status(400).json({message: "All input is required"})
			}

			if (
				typeof username != "string" ||
				typeof email != "string" ||
				typeof password != "string" ||
				typeof admin != "boolean"
			) {
				res.status(400).json({message: "Bad types in request body"})
			}

			let emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
			if (!emailRegex.test(email)) {
				res.status(400).json({
					message: "Email address provided is not valid"
				})
			}

			const exists = await api.database.getUserByEmail(email)
			if (exists != null) {
				return res.status(400).json({message: "User with this email address already exists"})
			}

			await api.database
				.createUser(username, email, password, admin)
				.then((result) => {
					console.log("User created:", result)
					return res.status(200).json({
						message: "User created:" + result
					})
				})
				.catch((error) => {
					console.error("Error:", error)
					return error
				})
		})

		this.router.post("/signin", async (req, res) => {
			const {email, password} = req.body
			if (!email || !password) {
				return res.status(400).json({message: "All input is required"})
			}

			const user = await api.database.getUserByEmail(email)
			if (user === null) {
				return res.status(401).json({message: "User not found"})
			}

			if (!(await argon2.verify(user?.password, password))) {
				return res.status(401).json({message: "Email & password combo was wrong"})
			}
			const userData = {
				userId: user?.id,
				username: user?.username,
				email: email,
				admin: user?.admin
			}
			const expiresIn = "8h"
			const token = this.auth.createToken(userData, expiresIn)
			if (!token) {
				return res.status(500).json({message: "Internal server error"})
			}
			return res.status(200).json({
				yuriToken: token
			}) // expires in 8h after creation
		})

		this.router.post("/signout", this.auth.authenticateToken, async (req, res) => {
			const authHeader = req.headers["yuri-auth-token"]
			if (!authHeader) {
				return res.status(401).json({message: "Access token not provided."})
			}
			let token = authHeader as string
			if (this.revokedTokens.has(token)) {
				return res.status(401).json({message: "Token has already been revoked"})
			}
			if (token) {
				this.revokedTokens.add(token)
				return res.status(200).json({
					message: `Token from ${req.user.username} has been revoked`
				})
			} else {
				return res.status(498).json({message: "Invalid token"})
			}
		})
	}

   get(){
      return this.router
   }
}
