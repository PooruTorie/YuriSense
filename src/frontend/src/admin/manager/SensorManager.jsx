import {Component} from "react"
import {Button, Card, Col, Grid, List, ListItem, Metric, Subtitle, Title} from "@tremor/react"
import {getUsers} from "../../api/user_api"
import {getSensors} from "../../api/sensor_api"
import {CogIcon, TrashIcon} from "@heroicons/react/solid"

export default class SensorManager extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sensors: [],
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
		getSensors().then((sensors) => this.setState({sensors}))
	}

	render() {
		return (
			<>
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
								<Col>
									<Button onClick={() => this.delUser(sensor.id)} color={"red"} icon={TrashIcon}>
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
