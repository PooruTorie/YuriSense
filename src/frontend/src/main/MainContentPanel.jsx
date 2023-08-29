import {Col, Grid, Metric, Text} from "@tremor/react"
import NewSensorManager from "./NewSensorManager"
import SensorCard from "./sensor/SensorCard"
import {getSensors} from "../api/api"
import OverviewContentPanel from "./overview/OverviewContentPanel"
import RealtimeComponent from "../utils/RealtimeComponent"

export default class MainContentPanel extends RealtimeComponent {
	constructor(props) {
		super(props)
		this.state = {sensors: [], selectedSensor: null}
	}

	componentDidMount() {
		super.componentDidMount()
		getSensors().then((sensors) => this.setState({sensors}))
	}

	componentRealtimeEventSourceMount() {
		this.eventSource.addEventListener("disconnect", (e) =>
			this.setState({
				sensors: this.state.sensors.filter((sensor) => sensor.uuid !== e.data)
			})
		)
		this.eventSource.addEventListener("connect", (e) =>
			this.setState({sensors: [...this.state.sensors, JSON.parse(e.data)]})
		)
	}

	render() {
		return (
			<Col numColSpan={5} className="h-[101%] overflow-auto">
				<div className="w-full border-none h-max p-4 border-x border-gray-200">
					<NewSensorManager onUpdate={() => getSensors().then((sensors) => this.setState({sensors}))} />
					{this.state.selectedSensor ? (
						<OverviewContentPanel
							sensor={this.state.selectedSensor}
							onClose={() => this.setState({selectedSensor: null})}
						/>
					) : (
						<>
							<Metric>Dashboard</Metric>
							<Text>All Sensors</Text>

							<Grid className="mt-6" numCols={this.state.sensors.length}>
								{this.state.sensors.map((sensor) => (
									<SensorCard sensor={sensor} doSelect={() => this.setState({selectedSensor: sensor})} />
								))}
							</Grid>
						</>
					)}
				</div>
			</Col>
		)
	}
}
