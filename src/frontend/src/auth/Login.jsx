import {Component} from "react"
import {TextInput, Card, Button, Callout} from "@tremor/react"
import {ExclamationIcon} from "@heroicons/react/solid"
import {signIn} from "../api/api"
import AuthContext from "./AuthContext"

export default class Login extends Component {
	static contextType = AuthContext

	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			error: undefined,
			email: "",
			emailError: undefined,
			password: "",
			passwordError: undefined
		}
	}

	async login() {
		let ready = true
		if (this.state.email === "") {
			this.setState({emailError: "Email is Empty"})
			ready = false
		}
		if (this.state.password === "") {
			this.setState({passwordError: "Password is Empty"})
			ready = false
		}
		if (ready) {
			this.setState({loading: true})
			const result = await signIn(this.state.email, this.state.password)
			if (result.error) {
				this.setState({loading: false, error: result.error})
			} else {
				this.context.setToken(result.yuriToken)
			}
		}
	}

	update(e) {
		if (e.target.value !== "") {
			this.setState({[e.target.name + "Error"]: undefined})
		}
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return (
			<Card>
				{!!this.state.error && (
					<Callout title="Login Failed" icon={ExclamationIcon} color="rose">
						{this.state.error}
					</Callout>
				)}
				<TextInput
					name={"email"}
					value={this.state.email}
					error={!!this.state.emailError}
					errorMessage={this.state.emailError}
					onChange={this.update.bind(this)}
					disabled={this.state.loading}
				/>
				<TextInput
					name={"password"}
					value={this.state.password}
					error={!!this.state.passwordError}
					errorMessage={this.state.passwordError}
					onChange={this.update.bind(this)}
					disabled={this.state.loading}
				/>
				<Button loading={this.state.loading} onClick={this.login.bind(this)}>
					Login
				</Button>
			</Card>
		)
	}
}

export class LogoutButton extends Component {
	static contextType = AuthContext

	render() {
		return (
			<Button {...this.props} onClick={this.context.logout}>
				{this.props.children}
			</Button>
		)
	}
}
