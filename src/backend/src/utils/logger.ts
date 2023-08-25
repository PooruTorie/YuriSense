import * as log4js from "log4js"
import * as util from "util"

export class Logger {
	static logger: log4js.Logger

	public static createLogger(level: string) {
		log4js.configure({
			appenders: {
				combined: {type: "file", filename: "log/combined.log"},
				api: {type: "file", filename: "log/api.log"},
				error: {type: "file", filename: "log/error.log"},
				justInfo: {
					type: "logLevelFilter",
					level: "INFO",
					appender: "combined"
				},
				justError: {
					type: "logLevelFilter",
					level: "ERROR",
					appender: "error"
				},
				console: {type: "console"}
			},
			categories: {
				default: {appenders: ["justInfo", "justError", "console"], level},
				api: {appenders: ["api", "justInfo", "justError", "console"], level}
			}
		})
		this.logger = log4js.getLogger()
	}

	public static error(...message) {
		this.logger.error(util.format(...message))
	}

	public static fatal(...message) {
		this.logger.fatal(util.format(...message))
	}

	public static debug(...message) {
		this.logger.debug(util.format(...message))
	}

	public static info(...message) {
		this.logger.info(util.format(...message))
	}

	public static warning(...message) {
		this.logger.warn(util.format(...message))
	}
}
