import {RowDataPacket} from "mysql2/promise"
import QueryCollection from "./query_collection"

export default class LoginRetryQuery extends QueryCollection {
	async createIP(ip: string): Promise<boolean> {
		const query =
			"INSERT INTO LoginRetries (ip, retries, lastRetry, waitTimeMinutes) VALUES (:ip, 1, CURRENT_TIMESTAMP(), 0)"
		return !(await this.connection.execute(query, {ip}))
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
		return !(await this.connection.execute(
			"UPDATE LoginRetries SET retries=retries+1, lastRetry=CURRENT_TIMESTAMP(), waitTimeMinutes=waitTimeMinutes*2 WHERE ip=:ip",
			{
				ip: ip
			}
		))
	}

	async decrememtRetryCount(ip: string): Promise<boolean> {
		return !(await this.connection.execute(
			"UPDATE LoginRetries SET retries=retries-1, waitTimeMinutes=0 WHERE ip=:ip",
			{
				ip: ip
			}
		))
	}

	async resetRetryCount(ip: string): Promise<boolean> {
		return !(await this.connection.execute("UPDATE LoginRetries SET retries=0, waitTimeMinutes=0 WHERE ip=:ip", {
			ip: ip
		}))
	}

	async initWaitTime(ip: string) {
		return !(await this.connection.execute("UPDATE LoginRetries SET waitTimeMinutes=1 WHERE ip=:ip", {
			ip: ip
		}))
	}
}
