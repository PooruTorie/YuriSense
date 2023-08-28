declare module "esp-ota" {
	import {EventEmitter} from "events"
	export default class EspOTA extends EventEmitter {
		constructor(
			serverHost: string = "0.0.0.0",
			serverPort: number = 0,
			chunkSize: number = 1460,
			timeout: number = 10
		)
		setPassword(password: string)
		uploadFirmware(filename: string, address: string, port: number = 3232)
	}
}
