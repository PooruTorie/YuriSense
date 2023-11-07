import {Component, lazy, Suspense} from "react"
import {Button, Callout, Card, Col, Grid, List, ListItem, Metric, Subtitle, TextInput, Title} from "@tremor/react"
import AuthContext from "../../auth/AuthContext"
import {CheckIcon, CogIcon, ExclamationIcon, PlusIcon, TrashIcon, XIcon} from "@heroicons/react/solid"
import {deleteUser, getUsers, updateUser} from "../../api/user_api"
import Modal from "react-modal"
import apiErrors from "../../api/errors"
import {signUp} from "../../api/auth_api"

const PasswordStrengthBar = lazy(() => import("react-password-strength-bar"))

export default class UserManager extends Component {
	static contextType = AuthContext

	constructor(props) {
		super(props)
		this.state = {
			users: [],
			addModalOpen: false,
			changeId: undefined,
			error: undefined,
			loading: false,
			firstName: "",
			firstNameOld: "",
			firstNameChange: false,
			firstNameError: undefined,
			lastName: "",
			lastNameOld: "",
			lastNameChange: false,
			lastNameError: undefined,
			phone: "",
			phoneOld: "",
			phoneChange: false,
			phoneError: undefined,
			email: "",
			emailOld: "",
			emailChange: false,
			emailError: undefined,
			passwordScore: 0,
			password: "",
			passwordError: undefined,
			repeatPassword: "",
			repeatPasswordError: undefined
		}
	}

	componentDidMount() {
		getUsers(this.context.token).then((users) => this.setState({users}))
	}

	render() {
		if (!this.context.auth.admin) {
			return (
				<Callout className={"h-fit m-auto w-1/2"} title="No Permission" icon={ExclamationIcon} color="rose">
					You have no permission to access this manager.
				</Callout>
			)
		}

		return (
			<>
				{this.state.addModalOpen || !!this.state.changeId ? this.getEditor() : null}
				<Metric>Users</Metric>
				<Button
					icon={PlusIcon}
					onClick={() =>
						this.setState({
							addModalOpen: true,
							Change: true,
							error: undefined,
							loading: false,
							firstName: "",
							firstNameOld: "",
							firstNameChange: false,
							firstNameError: undefined,
							lastName: "",
							lastNameOld: "",
							lastNameChange: false,
							lastNameError: undefined,
							phone: "",
							phoneOld: "",
							phoneChange: false,
							phoneError: undefined,
							email: "",
							emailOld: "",
							emailChange: false,
							emailError: undefined,
							passwordScore: 0,
							password: "",
							passwordError: undefined,
							repeatPassword: "",
							repeatPasswordError: undefined,
							admin: false,
							adminOld: false,
							adminChange: false
						})
					}
				>
					Add
				</Button>
				<List>
					{this.state.users.map((user) => (
						<ListItem>
							<Title className={"align-middle"}>
								{user.firstName} {user.lastName}
							</Title>{" "}
							<Grid numCols={12}>
								<Col numColSpan={2} className={"self-center"}>
									<Subtitle>Id: {user.id}</Subtitle>
								</Col>
								<Col numColSpan={4} className={"self-center"}>
									<Subtitle>Email: {user.email}</Subtitle>
								</Col>
								<Col numColSpan={4} className={"self-center"}>
									<Subtitle>Phone: {user.phone}</Subtitle>
								</Col>
								<Col>
									<Button
										icon={CogIcon}
										onClick={() =>
											this.setState({
												error: undefined,
												changeId: user.id,
												firstName: user.firstName,
												firstNameOld: user.firstName,
												firstNameError: undefined,
												firstNameChange: false,
												lastName: user.lastName,
												lastNameOld: user.lastName,
												lastNameError: undefined,
												lastNameChange: false,
												email: user.email,
												emailOld: user.email,
												emailError: undefined,
												emailChange: false,
												phone: user.phone,
												phoneOld: user.phone,
												phoneError: undefined,
												phoneChange: false,
												admin: user.admin,
												adminOld: user.admin,
												adminChange: false
											})
										}
									>
										Edit
									</Button>
								</Col>
								<Col>
									<Button onClick={() => this.delUser(user.id)} color={"red"} icon={TrashIcon}>
										Delete
									</Button>
								</Col>
							</Grid>
						</ListItem>
					))}
				</List>
			</>
		)
	}

	async delUser(id) {
		const result = await deleteUser(this.context.token, id)
		if (result.error) {
			this.setState({loading: false, error: apiErrors[result.error]})
		} else {
			this.setState({
				users: this.state.users.filter((user) => user.id !== id),
				error: undefined
			})
		}
	}

	async createUpdateUser() {
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
			if (!this.state.changeId) {
				this.setState({passwordError: "Password is Empty"})
				ready = false
			}
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
		if (ready) {
			this.setState({loading: true})
			if (this.state.changeId) {
				const result = await updateUser(
					this.context.token,
					this.state.changeId,
					this.state.firstName,
					this.state.lastName,
					this.state.email,
					this.state.password === "" ? null : this.state.password,
					this.state.phone,
					this.state.admin
				)
				if (result.error) {
					this.setState({loading: false, error: apiErrors[result.error]})
				} else {
					let users = this.state.users
					users[users.findIndex((user) => user.id === this.state.changeId)] = {
						id: this.state.changeId,
						firstName: this.state.firstName,
						lastName: this.state.lastName,
						email: this.state.email,
						phone: this.state.phone,
						admin: this.state.admin
					}
					this.setState({
						users,
						loading: false,
						addModalOpen: false,
						changeId: undefined,
						error: undefined
					})
				}
			} else {
				const result = await signUp(
					this.context.token,
					this.state.firstName,
					this.state.lastName,
					this.state.email,
					this.state.password,
					this.state.phone,
					this.state.admin
				)
				if (result.error) {
					this.setState({loading: false, error: apiErrors[result.error]})
				} else {
					this.setState({
						users: [
							...this.state.users,
							{
								id: result.id,
								firstName: this.state.firstName,
								lastName: this.state.lastName,
								email: this.state.email,
								phone: this.state.phone,
								admin: this.state.admin
							}
						],
						loading: false,
						addModalOpen: false,
						changeRackId: undefined,
						error: undefined
					})
				}
			}
		}
	}

	update(e) {
		if (e.target.value !== "") {
			this.setState({[e.target.name + "Error"]: undefined})
		}
		this.setState({
			[e.target.name]: e.target.value,
			[e.target.name + "Change"]: e.target.value !== this.state[e.target.name + "Old"]
		})
	}

	getEditor() {
		return (
			<Modal className={"inset-4"} isOpen={this.state.addModalOpen || !!this.state.changeId}>
				<div className={"text-center"}>
					<Metric className={"mb-10 mt-10"}>{this.state.addModalOpen ? "Create new User" : "Edit User"}</Metric>
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
							<Button
								className={"toggle-button w-full"}
								icon={this.state.admin ? CheckIcon : XIcon}
								variant={this.state.admin ? "primary" : "secondary"}
								onClick={() =>
									this.setState({
										admin: !this.state.admin,
										adminChange: this.state.admin === this.state.adminOld
									})
								}
							>
								Admin
							</Button>
							<Grid className={"mt-6"} numCols={2}>
								<Col className={"mr-0.5"}>
									<Button
										className={"w-[100%]"}
										loading={this.state.loading}
										onClick={this.createUpdateUser.bind(this)}
										disabled={
											!this.state.firstNameChange &&
											!this.state.lastNameChange &&
											!this.state.emailChange &&
											!this.state.phoneChange &&
											!this.state.adminChange
										}
									>
										{this.state.addModalOpen ? "Create User" : "Edit User"}
									</Button>
								</Col>
								<Col className={"ml-0.5"}>
									<Button
										color={"red"}
										className={"w-[100%]"}
										onClick={() =>
											this.setState({
												addModalOpen: false,
												changeId: undefined
											})
										}
									>
										Cancel
									</Button>
								</Col>
							</Grid>
						</Card>
					</div>
				</div>
			</Modal>
		)
	}
}
