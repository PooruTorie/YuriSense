import * as dgram from "dgram"
import {request} from "http"
import {AddressExtractor} from "../utils/address_extractor"
import {Logger} from "../utils/logger"

export default class SensorDiscovery {
	static socket: dgram.Socket
	static helloMessage: string = "OwO"

	public static setup(discoveryPort: number) {
		this.socket = dgram.createSocket("udp4")

		this.socket.on("message", (message: Buffer, remote: dgram.RemoteInfo) => {
			Logger.debug("Receive Discovery Answer", remote.address + ":" + remote.port, "-", message.toString())
			if (message.toString().startsWith("UwU")) {
				const address = message.toString().split("+")[1]
				Logger.info("Device Found:", address + ":" + remote.port)
				request("http://" + address + "/broker?ip=" + AddressExtractor.address, (res) => {
					Logger.debug("Broker send Responded:", res.statusCode)
				}).end()
			}
		})

		this.socket.on("listening", () => {
			const address = this.socket.address()
			Logger.info(`Listening Discovery... ${address.address}:${address.port}`)
		})

		this.socket.bind(discoveryPort)
	}

	public static async startDiscovery(discoveryPort: number) {
		Logger.debug("Broadcasting Discovery Hello on", AddressExtractor.broadcast)
		this.socket.setBroadcast(true)
		this.socket.send(
			SensorDiscovery.helloMessage,
			0,
			SensorDiscovery.helloMessage.length,
			discoveryPort,
			AddressExtractor.broadcast
		)

		return true
	}
}
