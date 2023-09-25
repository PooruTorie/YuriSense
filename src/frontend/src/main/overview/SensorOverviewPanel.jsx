import {Component} from "react"
import {Button, Flex} from "@tremor/react"
import {XIcon} from "@heroicons/react/solid"
import TemperatureOverview from "./TemperatureOverview"
import {getSensors} from "../../api/sensor_api"
import {withLoader} from "../../App"
import {Link, redirect} from "react-router-dom"

export class SensorOverviewPanel extends Component {
	constructor(props) {
		super(props)
		console.log(props)
	}

	render() {
		return (
			<>
				<Flex className="m-2" justifyContent="end">
					<Link to={"/"}>
						<Button icon={XIcon} color={"red"}>
							Close
						</Button>
					</Link>
				</Flex>
				<TemperatureOverview sensor={this.props.loaderData.sensor} />
			</>
		)
	}
}

const OverviewContentPanelWithLoader = withLoader(SensorOverviewPanel)
export default OverviewContentPanelWithLoader

export async function loader({params}) {
	const sensors = await getSensors()
	const sensor = sensors.find((s) => s.uuid === params.uuid)
	if (!sensor) {
		return redirect("/")
	}
	return {sensor}
}
