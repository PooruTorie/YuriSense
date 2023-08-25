import * as ip from "ip"
import {Logger} from "./logger"

export class AddressExtractor {
	public static address: string | undefined
	public static broadcast: string

	static extract() {
		this.address = process.env.IP_ADDRESS
		let netmask = process.env.NETMASK

		if (!this.address) {
			Logger.fatal("No ip address in envs")
			return false
		}

		if (!netmask) {
			Logger.fatal("No netmask in envs")
			return false
		}

		this.broadcast = ip.subnet(this.address, netmask).broadcastAddress

		Logger.debug("Address Extractor made:", this.address, this.broadcast)

		return true
	}
}
