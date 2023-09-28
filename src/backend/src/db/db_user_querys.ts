import argon2 from "argon2"
import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import QueryCollection from "./query_collection"

export default class UserQuery extends QueryCollection {
	async create(email: string, password: string, admin: boolean, firstName: string, lastName: string, phone: string) {
		const hash = await argon2.hash(password)
		// Assuming this.connection is a valid database connection
		const result: [ResultSetHeader, FieldPacket[]] = await this.connection.execute(
			"INSERT INTO User (email, password, admin, firstName, lastName, phone) VALUES (:email, :hash, :admin, :firstName, :lastName, :phone)",
			{email, hash, admin, firstName, lastName, phone}
		)
		return result[0].insertId
	}

	async getByEmail(email: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM User WHERE email = :email", {
			email
		})
		if (rows.length == 0) {
			return undefined
		}

		return rows[0]
	}

	async isFirst() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM User")
		return rows[0]["count"] === 0
	}
}
