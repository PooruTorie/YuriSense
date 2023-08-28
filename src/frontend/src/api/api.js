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

export async function signUp(username: string, email: string, password: string, admin: boolean) {
	const res = await fetch("/api/user/signup", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({username, email, password, admin})
	})
	return await res.json()
}

export async function signIn(email: string, password: string) {
	const res = await fetch("/api/user/signin", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({email, password})
	})
	return await res.json()
}

export async function signOut(token: string) {
	const res = await fetch("/api/user/signout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"yuri-auth-token": token
		}
	})
	return await res.json()
}
