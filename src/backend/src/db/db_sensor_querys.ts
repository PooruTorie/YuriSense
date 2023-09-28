import {FieldPacket, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import {Sensor} from "../mqtt/mqtt_client"
import QueryCollection from "./query_collection"

export default class SensorQuery extends QueryCollection {
	async getName(sensor: Sensor): Promise<string | null> {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT name FROM Sensor WHERE uuid=:uuid AND name IS NOT NULL LIMIT 1",
			{uuid: sensor.uuid}
		)
		return rows.length > 0 ? rows[0].name : null
	}

	async connect(sensor: Sensor) {
		const name = await this.getName(sensor)
		if (name) {
			this.connection.execute(
				"UPDATE Sensor SET connected=:ip, version=:version, type=:type, lastConnect=CURRENT_TIMESTAMP() WHERE uuid=:uuid",
				{
					uuid: sensor.uuid,
					ip: sensor.ip,
					type: sensor.type,
					version: sensor.firmwareVersion
				}
			)
			return name
		} else {
			if (await this.isNew(sensor)) {
				this.connection.execute(
					"INSERT INTO Sensor (uuid, connected, version, type) VALUES (:uuid, :ip, :version, :type)",
					{
						uuid: sensor.uuid,
						ip: sensor.ip,
						type: sensor.type,
						version: sensor.firmwareVersion
					}
				)
				return "new"
			}
		}
		return null
	}
	async allDead() {
		await this.connection.execute("UPDATE Sensor SET connected=NULL")
	}

	async dead(sensor: Sensor) {
		await this.connection.execute("UPDATE Sensor SET connected=NULL WHERE uuid=:uuid", {uuid: sensor.uuid})
	}

	async alive(sensor: Sensor) {
		await this.connection.execute("UPDATE Sensor SET connected=:ip WHERE uuid=:uuid", {
			uuid: sensor.uuid,
			ip: sensor.ip
		})
	}

	async uuidExists(uuid: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
			{uuid: uuid}
		)
		return rows.length > 0
	}

	async getConnected() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT * FROM Sensor WHERE name IS NOT NULL AND connected IS NOT NULL"
		)
		return rows
	}

	async getNew(): Promise<string[]> {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT uuid FROM Sensor WHERE name IS NULL")
		return rows.map((value) => value.uuid)
	}

	async setName(uuid: string, name: string) {
		await this.connection.execute("UPDATE Sensor SET name=:name WHERE uuid=:uuid", {uuid, name})
	}

	private async isNew(sensor: Sensor) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
			{uuid: sensor.uuid}
		)
		return rows.length == 0
	}
}
