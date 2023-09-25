import {Col} from "@tremor/react"
import NewSensorManager from "./NewSensorManager"
import {Outlet} from "react-router-dom"
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
