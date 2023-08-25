const os = require("os")
const fs = require("fs")
const env = require("dotenv")
const path = require("path")

env.config({path: path.join(__dirname, ".env")})

let interfaceName = process.env.INTERFACE

if (!interfaceName) {
	interfaceName = "Ethernet"
	const fileWriter = fs.openSync(path.join(__dirname, ".env"), "w")
	fs.writeSync(fileWriter, "INTERFACE=" + interfaceName + "\n")
	fs.closeSync(fileWriter)
}

let addressResult
const interfaces = os.networkInterfaces()
console.log(
	"Interfaces:",
	Object.entries(interfaces)
		.filter(
			([n, aa]) =>
				aa.filter((a) => a.family === "IPv4" && !a.internal).length > 0
		)
		.map(([n, a]) => n)
)
if (interfaces[interfaceName]) {
	for (const address of interfaces[interfaceName]) {
		if (address.family === "IPv4" && !address.internal) {
			addressResult = address
			break
		}
	}
}

if (addressResult) {
	const fileWriter = fs.openSync(path.join(__dirname, ".env"), "w")
	fs.writeSync(fileWriter, "INTERFACE=" + interfaceName + "\n")
	fs.writeSync(fileWriter, "IP_ADDRESS=" + addressResult.address + "\n")
	fs.writeSync(fileWriter, "NETMASK=" + addressResult.netmask + "\n")
	fs.closeSync(fileWriter)
} else {
	console.error("Cant find Interface with name", interfaceName)
	process.exit(100)
}
