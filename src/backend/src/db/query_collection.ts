import {Pool} from "mysql2/promise"
import DataBase from "./db_connection"

export default abstract class QueryCollection {
	protected readonly connection: Pool

	protected constructor(db: DataBase | Pool) {
		if ((db as DataBase).connection) {
			this.connection = (db as DataBase).connection
		} else {
			this.connection = db as Pool
		}
	}
}
