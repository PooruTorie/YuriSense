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

	async getById(id: number) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT * FROM Rack WHERE id=:id", {id})
		if (rows.length === 0) {
			return undefined
		}
		return rows[0]
	}

	async update(id: number, name: string, maxTemp: null | number) {
		await this.connection.execute("UPDATE Rack SET name=:name, maximalTemperature=:maxTemp WHERE id=:id", {
			name,
			id,
			maxTemp
		})
	}
}
