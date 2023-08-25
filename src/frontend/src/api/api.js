export async function getNewSensorUUIDs(): Promise<string[]> {
	const res = await fetch("/api/sensor/new")
	return await res.json()
}

export async function setSensorName(uuid: string, name: string) {
	const res = await fetch("/api/sensor/known", {
		method: "PUT",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({uuid, name})
	})
	return await res.json()
}

export async function getSensors() {
	const res = await fetch("/api/sensor/known")
	return await res.json()
}

export async function getSensorData(uuid: string) {
	const res = await fetch("/api/sensor/" + uuid)
	return await res.json()
}

export async function getSensorSettings(uuid: string) {
	const res = await fetch("/api/sensor/" + uuid + "/settings")
	return await res.json()
}

export async function getSensorDataTimeline(uuid: string, label: string) {
	const res = await fetch("/api/sensor/" + uuid + "/" + label)
	return await res.json()
}

export async function discover() {
	await fetch("/api/discover")
}

export async function getNewestVersion(type: string) {
	const res = await fetch("/api/updates/newest/" + type)
	return await res.json()
}

export async function updateSensor(uuid: string) {
	const res = await fetch("/api/updates/update/" + uuid)
	return await res.json()
}
