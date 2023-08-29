import {createPool, Field, FieldPacket, Pool, ResultSetHeader, RowDataPacket} from "mysql2/promise"
import {Sensor} from "../mqtt/mqtt_client"
const argon2 = require("argon2")

export default class DataBase {
	private connection: Pool

	constructor(host: string, password: string) {
		this.connection = createPool({
			uri: host,
			namedPlaceholders: true,
			password: password,
			database: "yurisense",
			charset: "utf8"
		})
	}

	async getName(sensor: Sensor): Promise<string | null> {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT name FROM Sensor WHERE uuid=:uuid AND name IS NOT NULL LIMIT 1",
			{uuid: sensor.uuid}
		)
		return rows.length > 0 ? rows[0].name : null
	}

	async collectSensorData(sensor: Sensor, messageLabel: string, message: Buffer) {
		await this.connection.execute(
			"INSERT IGNORE INTO SensorData (sensor, value, label) VALUES (:uuid, :value, :label)",
			{
				uuid: sensor.uuid,
				value: message,
				label: messageLabel
			}
		)
	}

	async connectNewSensor(sensor: Sensor) {
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

	async getNewSensors(): Promise<string[]> {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>("SELECT uuid FROM Sensor WHERE name IS NULL")
		return rows.map((value) => value.uuid)
	}

	async setName(uuid: string, name: string) {
		await this.connection.execute("UPDATE Sensor SET name=:name WHERE uuid=:uuid", {uuid, name})
	}

	async checkUUID(uuid: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
			{uuid: uuid}
		)
		return rows.length > 0
	}

	async getConnectedSensors() {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT * FROM Sensor WHERE name IS NOT NULL AND connected IS NOT NULL"
		)
		return rows
	}

	async getSingleSensorData(uuid: string) {
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

	async sensorAlive(sensor: Sensor) {
		await this.connection.execute("UPDATE Sensor SET connected=:ip WHERE uuid=:uuid", {
			uuid: sensor.uuid,
			ip: sensor.ip
		})
	}

	async allSensorsDead() {
		await this.connection.execute("UPDATE Sensor SET connected=NULL")
	}

	async getSensorData(uuid: string, label: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT timestamp, value FROM SensorData WHERE sensor=:uuid AND label LIKE :label;",
			{uuid, label}
		)
		return rows
	}

	async sensorDead(sensor: Sensor) {
		await this.connection.execute("UPDATE Sensor SET connected=NULL WHERE uuid=:uuid", {uuid: sensor.uuid})
	}

	private async isNew(sensor: Sensor) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT uuid FROM Sensor WHERE uuid=:uuid LIMIT 1",
			{uuid: sensor.uuid}
		)
		return rows.length == 0
	}

	async createUser(
		username: string,
		email: string,
		password: string,
		admin: boolean,
		firstName: string,
		lastName: string,
		phone: string
	) {
		const hash = await argon2.hash(password)
		// Assuming this.connection is a valid database connection
		const result: [ResultSetHeader, FieldPacket[]] = await this.connection.execute(
			"INSERT INTO User (username, email, password, admin, firstName, lastName, phone) VALUES (:username, :email, :hash, :admin, :firstName, :lastName, :phone)",
			{username, email, hash, admin, firstName, lastName, phone}
		)
		return result[0].insertId
	}

	async getUserByEmail(email: string) {
		const [rows, fields] = await this.connection.query<RowDataPacket[]>(
			"SELECT id, username, password, admin FROM User WHERE email = :email",
			{email}
		)
		if (rows.length == 0) {
			return null
		}

		return rows[0]
	}
}
