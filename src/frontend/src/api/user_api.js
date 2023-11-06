export async function getUsers(token: string) {
	const res = await fetch("/api/user/", {headers: {"yuri-auth-token": token}})
	return await res.json()
}

export async function updateUser(
	token: string,
	id: number,
	firstName: string,
	lastName: string,
	email: string,
	password: null | string,
	phone: string,
	admin: boolean
) {
	const res = await fetch("/api/user/" + id + "/", {
		method: "POST",
		headers: {"Content-Type": "application/json", "yuri-auth-token": token},
		body: JSON.stringify({firstName, lastName, password, email, phone, admin})
	})
	return await res.json()
}

export async function deleteUser(token: string, id: number) {
	const res = await fetch("/api/user/" + id + "/", {
		method: "DELETE",
		headers: {"yuri-auth-token": token}
	})
	return await res.json()
}
