import {Component} from "react"
import {Button, Callout, Card, Col, Grid, List, ListItem, Metric, Subtitle, TextInput, Title} from "@tremor/react"
import {createRack, getRacks, updateRack} from "../../api/rack_api"
import {CogIcon, ExclamationIcon, PlusIcon, TrashIcon} from "@heroicons/react/solid"
import Modal from "react-modal"
import apiErrors from "../../api/errors"
import AuthContext from "../../auth/AuthContext"

export default class RackManager extends Component {
	static contextType = AuthContext

	constructor(props) {
		super(props)
		this.state = {
			racks: [],
			addModalOpen: false,
			changeId: undefined,
			error: undefined,
			loading: false,
			rackName: "",
			rackNameOld: undefined,
			rackNameChange: false,
			rackNameError: undefined,
			maximalTemperature: "",
			maximalTemperatureOld: undefined,
			maximalTemperatureChange: false
		}
	}

	componentDidMount() {
		getRacks().then((racks) => this.setState({racks}))
	}

	async createUpdateRack() {
		let ready = true
		if (this.state.rackName === "") {
			this.setState({rackNameError: "Name is Empty"})
			ready = false
		}
		if (ready) {
			this.setState({loading: true})
			if (this.state.changeId) {
				const result = await updateRack(
					this.context.token,
					this.state.changeId,
					this.state.rackName,
					this.state.maximalTemperature
				)
				if (result.error) {
					this.setState({loading: false, error: apiErrors[result.error]})
				} else {
					let racks = this.state.racks
					racks[racks.findIndex((rack) => rack.id === this.state.changeId)] = {
						id: this.state.changeId,
						name: this.state.rackName,
						maximalTemperature: this.state.maximalTemperature
					}
					this.setState({
						racks,
						loading: false,
						addModalOpen: false,
						changeId: undefined
					})
				}
			} else {
				const result = await createRack(this.context.token, this.state.rackName)
				if (result.error) {
					this.setState({loading: false, error: apiErrors[result.error]})
				} else {
					this.setState({
						racks: [
							...this.state.racks,
							{
								id: result.rackId,
								name: this.state.rackName,
								maximalTemperature: null
							}
						],
						loading: false,
						addModalOpen: false,
						changeId: undefined,
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

	render() {
		return (
			<>
				<Metric>Racks</Metric>
				<Button
					icon={PlusIcon}
					onClick={() =>
						this.setState({
							addModalOpen: true,
							rackNameChange: true,
							error: undefined,
							rackName: "",
							rackNameOld: undefined,
							rackNameError: undefined,
							maximalTemperature: "",
							maximalTemperatureOld: undefined
						})
					}
				>
					Add
				</Button>
				<Modal className={"inset-4"} isOpen={this.state.addModalOpen || !!this.state.changeId}>
					<div className={"text-center"}>
						<Metric className={"mb-10 mt-10"}>{this.state.addModalOpen ? "Create new Rack" : "Edit Rack"}</Metric>
						<div className={"flex"}>
							<Card className={"h-fit m-auto w-1/2"}>
								{!!this.state.error && (
									<Callout title="Signup Failed" icon={ExclamationIcon} color="rose">
										{this.state.error}
									</Callout>
								)}
								<TextInput
									className={"m-1"}
									placeholder={"Rack Name"}
									name={"rackName"}
									maxLength={45}
									value={this.state.rackName}
									error={!!this.state.rackNameError}
									errorMessage={this.state.rackNameError}
									onChange={this.update.bind(this)}
									disabled={this.state.loading}
								/>
								{this.state.addModalOpen ? null : (
									<TextInput
										className={"m-1"}
										placeholder={"Maximal Temperature"}
										name={"maximalTemperature"}
										type={"number"}
										value={this.state.maximalTemperature}
										onChange={this.update.bind(this)}
										disabled={this.state.loading}
									/>
								)}
								<Grid className={"mt-6"} numCols={2}>
									<Col className={"mr-0.5"}>
										<Button
											className={"w-[100%]"}
											loading={this.state.loading}
											onClick={this.createUpdateRack.bind(this)}
											disabled={!this.state.rackNameChange && !this.state.maximalTemperatureChange}
										>
											{this.state.addModalOpen ? "Create Rack" : "Edit Rack"}
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
				<List>
					{this.state.racks.map((rack) => (
						<ListItem>
							<Title className={"align-middle"}>{rack.name}</Title>
							<Grid numCols={12}>
								<Col numColSpan={2} className={"self-center"}>
									<Subtitle>Id: {rack.id}</Subtitle>
								</Col>
								<Col numColSpan={6} className={"self-center"}>
									<Subtitle>Max Temperature: {rack.maximalTemperature || "Not Set"}</Subtitle>
								</Col>
								<Col>
									<Button
										icon={CogIcon}
										onClick={() =>
											this.setState({
												error: undefined,
												changeId: rack.id,
												rackName: rack.name,
												rackNameOld: rack.name,
												rackNameError: undefined,
												maximalTemperature: rack.maximalTemperature + "",
												maximalTemperatureOld: rack.maximalTemperature + "",
												rackNameChange: false,
												maximalTemperatureChange: false
											})
										}
									>
										Edit
									</Button>
								</Col>
								<Col>
									<Button color={"red"} icon={TrashIcon}>
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
}
