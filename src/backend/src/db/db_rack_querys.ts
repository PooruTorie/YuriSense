import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import QueryCollection from "./query_collection"

export default class RackQuery extends QueryCollection {
	async create(name: any) {
		const result: [ResultSetHeader, FieldPacket[]] = await this.connection.execute(
			"INSERT INTO Rack (name) VALUES (:name)",
			{name}
		)
		return result[0].insertId
	}

	async get() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM Rack")
		return rows
	}
}
