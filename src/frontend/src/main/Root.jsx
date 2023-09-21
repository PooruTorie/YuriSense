import {Col, Grid, Metric, Text} from "@tremor/react"
import NewSensorManager from "./NewSensorManager"
import SensorCard from "./sensor/SensorCard"
import {getSensors} from "../api/api"
import RealtimeComponent from "../utils/RealtimeComponent"
import {Outlet, useLoaderData} from "react-router-dom"
import {withLoader} from "../App"
import {Component} from "react"

export class Root extends Component {
	render() {
		return (
			<Col numColSpan={5} className="h-[101%] overflow-auto">
				<div className="w-full border-none h-max p-4 border-x border-gray-200">
					<NewSensorManager onUpdate={() => this.props.navigate("/")} />
					<Outlet />
				</div>
			</Col>
		)
	}
}

const RootWithLoader = withLoader(Root)
export default RootWithLoader
