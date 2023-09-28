import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import {Sensor} from "../mqtt/mqtt_client"
import QueryCollection from "./query_collection"

export default class SensorDataQuery extends QueryCollection {
	async add(sensor: Sensor, messageLabel: string, message: Buffer) {
		await this.connection.execute(
			"INSERT IGNORE INTO SensorData (sensor, value, label) VALUES (:uuid, :value, :label)",
			{
				uuid: sensor.uuid,
				value: message,
				label: messageLabel
			}
		)
	}
	async get(uuid: string, label: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT timestamp, value FROM SensorData WHERE sensor=:uuid AND label LIKE :label;",
			{uuid, label}
		)
		return rows
	}

	async getSingle(uuid: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT timestamp, value, label FROM (SELECT timestamp, value, label, ROW_NUMBER() OVER(PARTITION BY label ORDER BY timestamp DESC) rn FROM SensorData WHERE sensor=:uuid AND label NOT LIKE :alive) a WHERE rn=1;",
			{uuid, alive: "keepalive"}
		)
		let data = {}
		rows.forEach((row) => {
			data[row.label] = row.value.toString()
		})
		return data
	}
}
