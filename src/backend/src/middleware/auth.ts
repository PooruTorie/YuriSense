import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

declare global {
	namespace Express {
		interface Request {
			user?: any
		}
	}
}

export default class AuthMiddleware {
	authenticateToken(req: Request, res: Response, next: NextFunction) {
		const secretKey = process.env.SECRET_KEY as string
		if (!secretKey) {
			return res.status(500).json({message: "Internal server error"})
		}
		const authHeader = req.headers["yuri-auth-token"]
		//console.log('key on authentication' + this.secretKey)
		if (!authHeader) {
			return res.status(401).json({message: "Access token not provided."})
		}

		console.log(authHeader)
		const token = authHeader as string

		jwt.verify(token, secretKey, (err, user) => {
			if (err) {
				return res.status(498).json({message: "Invalid token."})
			}
			req.user = user
			next()
		})
	}

	createToken(data: any, expiresIn: string | number): string | null {
		console.log("Key on token creation: " + this)
		const secretKey = process.env.SECRET_KEY as string
		if (!secretKey) {
			return null
		}
		const token = jwt.sign(data, secretKey, {expiresIn})
		return token
	}
}
