export async function getRacks(): Promise<string[]> {
	const res = await fetch("/api/rack/")
	return await res.json()
}

export async function createRack(token: string, name: string) {
	const res = await fetch("/api/rack/", {
		method: "POST",
		headers: {"Content-Type": "application/json", "yuri-auth-token": token},
		body: JSON.stringify({name})
	})
	return await res.json()
}

export async function updateRack(token: string, id: number, name: string, maxTemperature: string) {
	const res = await fetch("/api/rack/" + id + "/", {
		method: "POST",
		headers: {"Content-Type": "application/json", "yuri-auth-token": token},
		body: JSON.stringify({name, maxTemperature})
	})
	return await res.json()
}
