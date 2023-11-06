export async function signUp(
	token: string,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	phone: string,
	admin: boolean
) {
	const res = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {"Content-Type": "application/json", "yuri-auth-token": token},
		body: JSON.stringify({firstName, lastName, email, password, phone, admin})
	})
	return await res.json()
}

export async function signIn(email: string, password: string) {
	const res = await fetch("/api/auth/signin", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({email, password})
	})
	return await res.json()
}

export async function signOut(token: string) {
	const res = await fetch("/api/auth/signout", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"yuri-auth-token": token
		}
	})
	return await res.json()
}

export async function isInitAvailable() {
	const res = await fetch("/api/auth/init")
	return (await res.json()).initAvailable
}

export async function initAdmin(firstName: string, lastName: string, email: string, password: string, phone: string) {
	const res = await fetch("/api/auth/init", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({firstName, lastName, email, password, phone})
	})
	return await res.json()
}
