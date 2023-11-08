import {Component} from "react"
import {Button, Callout, Card, Metric, TextInput, Title} from "@tremor/react"
import {ExclamationIcon} from "@heroicons/react/solid"
import {signIn} from "../api/auth_api"
import AuthContext from "./AuthContext"
import {Link} from "react-router-dom"
import apiErrors from "../api/errors"
import logo from "../assets/logo.svg"
import loadingGif from "../assets/snoop-dogg-dance.gif"
import ConfettiExplosion from "react-confetti-explosion"

export default class Login extends Component {
	static contextType = AuthContext

	timer: NodeJS.Timeout = 0

	constructor(props) {
		super(props)
		this.state = {
			confetti: false,
			loading: false,
			error: undefined,
			waitError: false,
			email: "",
			emailError: undefined,
			password: "",
			passwordError: undefined
		}
		this.startTimer = this.startTimer.bind(this)
		this.countDown = this.countDown.bind(this)
	}

	secondsToTime(secs) {
		let hours = Math.floor(secs / (60 * 60))

		let divisor_for_minutes = secs % (60 * 60)
		let minutes = Math.floor(divisor_for_minutes / 60)

		let divisor_for_seconds = divisor_for_minutes % 60
		let seconds = Math.ceil(divisor_for_seconds)

		return (
			(hours > 0 ? (hours + ":").padStart(3, "0") : "") +
			(minutes + ":").padStart(3, "0") +
			("" + seconds).padStart(2, "0")
		)
	}

	startTimer() {
		if (this.timer === 0) {
			this.timer = setInterval(this.countDown, 1000)
		}
	}

	countDown() {
		const timeElapsed = this.state.timeElapsed + 1

		if (timeElapsed === this.state.waitTime) {
			this.setState({
				waitError: false,
				confetti: true
			})
			clearInterval(this.timer)
			this.timer = 0
			return
		}

		this.setState({timeElapsed})
	}

	async login() {
		let ready = true
		if (this.state.email === "") {
			this.setState({emailError: "Email is Empty"})
			ready = false
		} else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(this.state.email)) {
			this.setState({emailError: "Email is not valide"})
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
				if (result.error === "waittime_not_over") {
					this.setState({
						loading: false,
						waitError: true,
						waitTime: result.waitTimeSeconds,
						timeElapsed: Math.round(result.timeElapsed),
						confetti: false
					})
					this.startTimer()
				}
				this.setState({loading: false, error: apiErrors[result.error]})
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
			<>
				<Link to={"/"}>
					<img className={"w-[20%] mt-32 mb-10 m-auto"} src={logo} alt="YuriSense Logo" />
				</Link>
				<div className={"flex"}>
					<Card className={"h-fit m-auto w-1/2"}>
						{!!this.state.error && (
							<Callout title="Login Failed" icon={ExclamationIcon} color="rose">
								{this.state.error}
							</Callout>
						)}
						{this.state.waitError && (
							<>
								{this.state.waitTime - this.state.timeElapsed <= 10 ? (
									<img src={loadingGif} className="fixed bottom-0 left-0 -z-30" />
								) : null}
								<Callout title="Login Failed" icon={ExclamationIcon} color="rose">
									<div className="pb-1">
										Please wait before your next Login
										<Metric color="rose">
											{this.secondsToTime(this.state.waitTime - this.state.timeElapsed)}
										</Metric>
									</div>
								</Callout>
							</>
						)}
						{this.state.confetti && (
							<ConfettiExplosion
								className="m-auto w-1"
								force={0.4}
								colors={["#d3181f", "#004176"]}
								particleCount={100}
								width={1000}
							/>
						)}
						<TextInput
							className={"m-1"}
							placeholder={"Email"}
							name={"email"}
							value={this.state.email}
							error={!!this.state.emailError}
							errorMessage={this.state.emailError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
						/>
						<TextInput
							className={"m-1"}
							placeholder={"Password"}
							name={"password"}
							type={"password"}
							value={this.state.password}
							error={!!this.state.passwordError}
							errorMessage={this.state.passwordError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
							onKeyDown={(e) => {
								if (e.code === "Enter") {
									this.login()
								}
							}}
						/>
						<Button
							className={"w-[100%] m-1"}
							loading={this.state.loading || this.state.waitError}
							disabled={this.state.waitError}
							onClick={this.login.bind(this)}
						>
							Login
						</Button>
					</Card>
				</div>
			</>
		)
	}
}

export class LogoutButton extends Component {
	static contextType = AuthContext

	render() {
		return (
			<Button {...this.props} onClick={() => this.context.logout(this.props.to)}>
				{this.props.children}
			</Button>
		)
	}
}
