export async function signUp(firstName: string, lastName: string, email: string, password: string, phone: string) {
	const res = await fetch("/api/user/signup", {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({firstName, lastName, email, password, phone})
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
