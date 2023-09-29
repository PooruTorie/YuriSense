import React, {Component, Context} from "react"
import jwt_decode from "jwt-decode"
import {signOut} from "../api/auth_api"
import {withLoader} from "../App"

const AuthContext: Context<{
	userId: number,
	firstName: string,
	lastName: string,
	phone: string,
	email: string,
	admin: boolean
}> = React.createContext()

class AuthProviderClass extends Component {
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

	async logout(to) {
		localStorage.removeItem("auth")
		if (to) {
			await this.props.navigate(to)
		}
		await signOut(this.state.token)
		this.setState({token: undefined, auth: undefined})
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

export const AuthProvider = withLoader(AuthProviderClass)

export const AuthConsumer = AuthContext.Consumer

export default AuthContext
