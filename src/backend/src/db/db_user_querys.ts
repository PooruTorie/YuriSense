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

	async createIP(ip: string): Promise<boolean> {
		const retries = 1
		const query = "INSERT INTO LoginRetries (ip, retries, lastRetry) VALUES (?, ?, ?)"
		const params = [ip, retries, new Date().toISOString().slice(0, 19).replace("T", " ")]
		return !(await this.connection.execute(query, params))
	}

	async getRetryDataByIP(ip: string): Promise<{
		ip: string
		retries: number
		waitTimeMinutes: number
		lastRetry: string
	} | null> {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM LoginRetries WHERE ip = :ip", {
			ip
		})
		if (rows.length === 0) {
			return null
		}
		return {
			ip: rows[0].ip,
			retries: rows[0].retries,
			waitTimeMinutes: rows[0].waitTimeMinutes,
			lastRetry: rows[0].lastRetry
		}
	}

	async incrementRetryCount(ip: string): Promise<boolean> {
		const currentRetryData = await this.getRetryDataByIP(ip)
		if (currentRetryData === null) {
			return false
		}
		if (!(currentRetryData.retries < 3)) {
			return false
		}
		return !(await this.connection.execute(
			"UPDATE LoginRetries SET retries=:retries, lastRetry=:lastRetry, waitTimeMinutes=:waitTimeMinutes WHERE ip=:ip",
			{
				retries: currentRetryData.retries++,
				lastRetry: new Date().toISOString().slice(0, 19).replace("T", " "),
				waitTimeMinutes: currentRetryData.waitTimeMinutes * 2,
				ip: ip
			}
		))
	}

	async resetRetryCount(ip: string): Promise<boolean> {
		const currentRetryData = await this.getRetryDataByIP(ip)
		if (currentRetryData === null) {
			return false
		}
		if (!(currentRetryData.retries >= 0)) {
			return false
		}
		return !(await this.connection.execute("UPDATE LoginRetries SET retries=:retries WHERE ip=:ip", {
			retries: currentRetryData.retries - 1,
			ip: ip
		}))
	}

	async get() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT id, email, admin, firstName, lastName, phone FROM User"
		)
		return rows
	}

	async getById(id: number) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM User WHERE id=:id", {id})
		if (rows.length === 0) {
			return undefined
		}
		return rows[0]
	}

	async update(
		id: number,
		firstName: string,
		lastName: string,
		password: undefined | string,
		email: string,
		phone: string,
		admin: boolean
	) {
		if (password) {
			const hash = await argon2.hash(password)
			await this.connection.execute(
				"UPDATE User SET firstName=:firstName, lastName=:lastName, email=:email, phone=:phone, admin=:admin, password=:hash WHERE id=:id",
				{
					id,
					firstName,
					lastName,
					email,
					phone,
					admin,
					hash
				}
			)
		} else {
			await this.connection.execute(
				"UPDATE User SET firstName=:firstName, lastName=:lastName, email=:email, phone=:phone, admin=:admin WHERE id=:id",
				{
					id,
					firstName,
					lastName,
					email,
					phone,
					admin
				}
			)
		}
	}

	async delete(id: number) {
		await this.connection.execute("DELETE FROM User WHERE id=:id", {id})
	}
}
