import {Component} from "react"
import {Button, Callout, Card, Col, Grid, List, ListItem, Metric, Subtitle, TextInput, Title} from "@tremor/react"
import {getSensors, setSensorName} from "../../api/sensor_api"
import {CogIcon, ExclamationIcon} from "@heroicons/react/solid"
import apiErrors from "../../api/errors"
import Modal from "react-modal"

export default class SensorManager extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sensors: [],
			changeId: undefined,
			error: undefined,
			loading: false,
			name: "",
			nameOld: "",
			nameChange: false,
			nameError: undefined
		}
	}

	componentDidMount() {
		getSensors().then((sensors) => this.setState({sensors}))
	}

	render() {
		return (
			<>
				{!!this.state.changeId ? this.getEditor() : null}
				<Metric>Sensors</Metric>
				<List>
					{this.state.sensors.map((sensor) => (
						<ListItem>
							<Title className={"align-middle"}>{sensor.name}</Title>{" "}
							<Grid numCols={12}>
								<Col numColSpan={4} className={"self-center"}>
									<Subtitle>UUID: {sensor.uuid}</Subtitle>
								</Col>
								<Col numColSpan={6} className={"self-center"}>
									<Subtitle>Max Temp: {sensor.maxTemperature}</Subtitle>
								</Col>
								<Col>
									<Button
										icon={CogIcon}
										onClick={() =>
											this.setState({
												error: undefined,
												changeId: sensor.id,
												name: sensor.name,
												nameOld: sensor.name,
												nameError: undefined,
												nameChange: false
											})
										}
									>
										Edit
									</Button>
								</Col>
							</Grid>
						</ListItem>
					))}
				</List>
			</>
		)
	}

	async updateSensor() {
		let ready = true
		if (this.state.name === "") {
			this.setState({nameError: "Name is Empty"})
			ready = false
		}
		if (ready) {
			this.setState({loading: true})
			const result = await setSensorName(this.state.changeId, this.state.name)
			if (result.error) {
				this.setState({loading: false, error: apiErrors[result.error]})
			} else {
				let sensors = this.state.sensors
				const changeIndex = sensors.findIndex((sensor) => sensor.uuid === this.state.changeId)
				sensors[changeIndex] = {name: this.state.name, ...sensors[changeIndex]}
				this.setState({
					sensors,
					loading: false,
					changeId: undefined,
					error: undefined
				})
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
							<Grid className={"mt-6"} numCols={2}>
								<Col className={"mr-0.5"}>
									<Button
										className={"w-[100%]"}
										loading={this.state.loading}
										onClick={this.updateSensor.bind(this)}
										disabled={!this.state.nameChange}
									>
										Edit Sensor
									</Button>
								</Col>
								<Col className={"ml-0.5"}>
									<Button
										color={"red"}
										className={"w-[100%]"}
										onClick={() =>
											this.setState({
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
