import React, {Component} from "react"
import jwt_decode from "jwt-decode"
import {signOut} from "../api/auth_api"

const AuthContext = React.createContext()

export class AuthProvider extends Component {
	constructor(props) {
		super(props)
		this.state = {
			token: undefined,
			auth: undefined,
			setToken: this.setToken.bind(this),
			logout: this.logout.bind(this)
		}
	}

	componentDidMount() {
		const token = localStorage.getItem("auth")
		if (token) {
			this.setToken(token)
		}
	}

	async logout() {
		await signOut(this.state.token)
		this.setState({token: undefined, auth: undefined})
		localStorage.removeItem("auth")
	}

	setToken(token) {
		try {
			this.setState({token, auth: jwt_decode(token)})
			localStorage.setItem("auth", token)
		} catch (e) {
			console.log(e)
		}
	}

	render() {
		return (
			<AuthContext.Provider value={this.state}>
				{(() => (!this.state.auth ? this.props.login : this.props.children))()}
			</AuthContext.Provider>
		)
	}
}
export const AuthConsumer = AuthContext.Consumer

export default AuthContext
