import {Component, lazy, Suspense} from "react"
import {TextInput, Card, Button, Callout, Subtitle, Col, Grid} from "@tremor/react"
import {ExclamationIcon} from "@heroicons/react/solid"
import {signUp} from "../api/auth_api"
import {LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha} from "react-simple-captcha"
import {Link} from "react-router-dom"
import apiErrors from "../api/errors"
import {withLoader} from "../App"
import logo from "../assets/logo.svg"

const PasswordStrengthBar = lazy(() => import("react-password-strength-bar"))

class Signup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			error: undefined,
			firstName: "",
			firstNameError: undefined,
			lastName: "",
			lastNameError: undefined,
			phone: "",
			phoneError: undefined,
			email: "",
			emailError: undefined,
			passwordScore: 0,
			password: "",
			passwordError: undefined,
			repeatPassword: "",
			repeatPasswordError: undefined,
			captcha: "",
			captchaError: undefined
		}
	}

	componentDidMount() {
		loadCaptchaEnginge(6, "white", "black", "lower")
	}

	async login() {
		let ready = true
		if (this.state.firstName === "") {
			this.setState({firstNameError: "First Name is Empty"})
			ready = false
		}
		if (this.state.lastName === "") {
			this.setState({lastNameError: "Last Name is Empty"})
			ready = false
		}
		if (this.state.phone === "") {
			this.setState({phoneError: "Phone is Empty"})
			ready = false
		} else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(this.state.phone)) {
			this.setState({phoneError: "Phone is not valide"})
			ready = false
		}
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
		} else if (this.state.password.length < 8) {
			this.setState({passwordError: "Password is to short"})
			ready = false
		} else if (this.state.passwordScore < 2) {
			this.setState({passwordError: "Password is to weak"})
			ready = false
		} else if (this.state.password !== this.state.repeatPassword) {
			this.setState({repeatPasswordError: "Password is not the same"})
			ready = false
		}
		if (this.state.captcha === "") {
			this.setState({captchaError: "Captcha is Empty"})
			ready = false
		} else if (!validateCaptcha(this.state.captcha)) {
			this.setState({captchaError: "Captcha is Wrong"})
			ready = false
		}
		if (ready) {
			this.setState({loading: true})
			const result = await signUp(
				this.state.firstName,
				this.state.lastName,
				this.state.email,
				this.state.password,
				this.state.phone
			)
			if (result.error) {
				this.setState({loading: false, error: apiErrors[result.error]})
			} else {
				console.log(result)
				this.props.navigate("/admin")
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
					<img className={"w-[20%] mt-10 mb-10 m-auto"} src={logo} alt="YuriSense Logo" />
				</Link>
				<div className={"flex"}>
					<Card className={"h-fit m-auto w-1/2"}>
						{!!this.state.error && (
							<Callout title="Signup Failed" icon={ExclamationIcon} color="rose">
								{this.state.error}
							</Callout>
						)}
						<Grid numCols={2} className={"mt-1 mb-1"}>
							<Col className={"mr-0.5"}>
								<TextInput
									placeholder={"First Name"}
									name={"firstName"}
									maxLength={50}
									value={this.state.firstName}
									error={!!this.state.firstNameError}
									errorMessage={this.state.firstNameError}
									onChange={this.update.bind(this)}
									disabled={this.state.loading}
								/>
							</Col>
							<Col className={"ml-0.5"}>
								<TextInput
									placeholder={"Last Name"}
									name={"lastName"}
									maxLength={50}
									value={this.state.lastName}
									error={!!this.state.lastNameError}
									errorMessage={this.state.lastNameError}
									onChange={this.update.bind(this)}
									disabled={this.state.loading}
								/>
							</Col>
						</Grid>
						<Grid numCols={2} className={"mt-1 mb-1"}>
							<Col className={"mr-0.5"}>
								<TextInput
									placeholder={"Email"}
									name={"email"}
									maxLength={100}
									value={this.state.email}
									error={!!this.state.emailError}
									errorMessage={this.state.emailError}
									onChange={this.update.bind(this)}
									disabled={this.state.loading}
								/>
							</Col>
							<Col className={"ml-0.5"}>
								<TextInput
									placeholder={"Phone"}
									name={"phone"}
									maxLength={50}
									value={this.state.phone}
									error={!!this.state.phoneError}
									errorMessage={this.state.phoneError}
									onChange={this.update.bind(this)}
									disabled={this.state.loading}
								/>
							</Col>
						</Grid>
						<TextInput
							className={"mt-1 mb-1"}
							placeholder={"Password"}
							name={"password"}
							type={"password"}
							value={this.state.password}
							error={!!this.state.passwordError}
							errorMessage={this.state.passwordError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
						/>
						<Suspense fallback={<Subtitle>Loading ...</Subtitle>}>
							<PasswordStrengthBar
								onChangeScore={(passwordScore) => this.setState({passwordScore})}
								minLength={8}
								password={this.state.password}
							/>
						</Suspense>
						<TextInput
							className={"mt-1 mb-1"}
							placeholder={"Repeat Password"}
							name={"repeatPassword"}
							type={"password"}
							value={this.state.repeatPassword}
							error={!!this.state.repeatPasswordError}
							errorMessage={this.state.repeatPasswordError}
							onChange={this.update.bind(this)}
							disabled={this.state.loading}
						/>
						<div className={"mt-3"}>
							<LoadCanvasTemplateNoReload />
							<TextInput
								className={"mt-1 mb-1"}
								placeholder={"Captcha Value"}
								name={"captcha"}
								maxLength={6}
								value={this.state.captcha}
								error={!!this.state.captchaError}
								errorMessage={this.state.captchaError}
								onChange={this.update.bind(this)}
								disabled={this.state.loading}
							/>
						</div>
						<Link className={"mt-3 text-center"} to={"/admin"}>
							<Subtitle className={"hover:text-blue-600"}>Login</Subtitle>
						</Link>
						<Button className={"m-1 w-[100%]"} loading={this.state.loading} onClick={this.login.bind(this)}>
							Register
						</Button>
					</Card>
				</div>
			</>
		)
	}
}

const SignupWithLoader = withLoader(Signup)
export default SignupWithLoader
