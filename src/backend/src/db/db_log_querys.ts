import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import QueryCollection from "./query_collection"

export default class LogQuery extends QueryCollection {
	async add(rackId: number, userId: number, oldValue: null | string) {
		const result: [ResultSetHeader, FieldPacket[]] = await this.connection.execute(
			"INSERT INTO Log (rack, user, oldTemperature) VALUES (:rackId, :userId, :oldValue)",
			{rackId, userId, oldValue}
		)
		return result[0].insertId
	}

	async get() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM Log")
		return rows
	}
}
