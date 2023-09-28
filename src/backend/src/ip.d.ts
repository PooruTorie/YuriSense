declare module "ip" {
	export function subnet(address: string, netmask: string): {broadcastAddress: string}
}
