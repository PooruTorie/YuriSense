export async function getRacks(): Promise<string[]> {
	const res = await fetch("/api/rack/")
	return await res.json()
}

export async function createRack(name: string) {
	const res = await fetch("/api/rack/", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({name})
	})
	return await res.json()
}
