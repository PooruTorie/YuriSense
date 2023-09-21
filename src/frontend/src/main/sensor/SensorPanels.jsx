import {Component} from "react"
import {Grid, Metric, Text} from "@tremor/react"
import SensorCard from "./SensorCard"
import RealtimeComponent from "../../utils/RealtimeComponent"
import {withLoader} from "../../App"
import {getSensors} from "../../api/api"

class SensorPanels extends RealtimeComponent {
	constructor(props) {
		super(props)
		this.state = {sensors: props.loaderData.sensors, selectedSensor: null}
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
			<>
				<Metric>Dashboard</Metric>
				<Text>All Sensors</Text>

				<Grid className="mt-6" numCols={this.state.sensors.length}>
					{this.state.sensors.map((sensor) => (
						<SensorCard sensor={sensor} />
					))}
				</Grid>
			</>
		)
	}
}

const SensorPanelsWithLoader = withLoader(SensorPanels)
export default SensorPanelsWithLoader

export async function loader() {
	const sensors = await getSensors()
	return {sensors}
}
