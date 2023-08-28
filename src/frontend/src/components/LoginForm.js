import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {loginFailure, loginSuccess} from "./authSlice"
import {signIn} from "../api/api"

function LoginForm() {
	const dispatch = useDispatch()

	// Declare state variables for username and password
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	// Handle input change events
	const handleUsernameChange = (event) => {
		setUsername(event.target.value)
	}

	// Handle input change events
	const handlePasswordChange = (event) => {
		setPassword(event.target.value)
	}

	// Handle form submit event
	const handleSubmit = (event) => {
		event.preventDefault()
		signIn(username, password)
			.then((response) => {
				console.log(response)
				dispatch(loginSuccess(response.token))
			})
			.then(() => {
				setUsername("")
				setPassword("")
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<form onSubmit={handleSubmit} id="login-form">
			<h1>YuriSense</h1>
			<br />
			<input
				type="text"
				id="username"
				name="username"
				placeholder="Nutzername"
				value={username}
				onChange={handleUsernameChange}
				required
			/>
			<br />
			<input
				type="password"
				id="password"
				name="password"
				placeholder="Passwort"
				value={password}
				onChange={handlePasswordChange}
				required
			/>
			<br />
			<button id="login-button" type="submit">
				Login
			</button>
		</form>
	)
}

export default LoginForm
