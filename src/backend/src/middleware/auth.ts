import {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import {Logger} from "../utils/logger"

declare global {
	class UserData {
		userId: number
		username: string
		email: string
		admin: boolean
	}
	class AuthedUser extends UserData {
		token: string
	}

	namespace Express {
		interface Request {
			user?: AuthedUser
		}
	}
}

export default class AuthMiddleware {
	private static revokedTokens: Set<string> = new Set()

	authenticateToken(req: Request, res: Response, next: NextFunction) {
		const secretKey = process.env.SECRET_KEY as string
		if (!secretKey) {
			return res.status(500).json({message: "Internal server error"})
		}
		const token = req.headers["yuri-auth-token"] as string | null | undefined

		if (!token) {
			return res.status(401).json({message: "Access token not provided."})
		}

		if (AuthMiddleware.revokedTokens.has(token)) {
			return res.status(401).json({message: "Access token was revoked."})
		}

		jwt.verify(token, secretKey, (err, user) => {
			if (err) {
				return res.status(498).json({message: "Invalid token."})
			}
			req.user = {
				...(user as UserData),
				token
			}
			next()
		})
	}

	revokeToken(user: AuthedUser) {
		AuthMiddleware.revokedTokens.add(user.token)
	}

	createToken(data: UserData, expiresIn: string | number): string | null {
		const secretKey = process.env.SECRET_KEY as string
		if (!secretKey) {
			Logger.warning("No SECRET_KEY for Token generation")
			return null
		}
		return jwt.sign(data, secretKey, {expiresIn})
	}
}
