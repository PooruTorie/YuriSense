import {Button, Col} from "@tremor/react"
import NewSensorManager from "./NewSensorManager"
import {Link, Outlet} from "react-router-dom"
import {withLoader} from "../App"
import {Component} from "react"
import TopBar, {DiscoverButton} from "../menu/TopBar"
import {AuthConsumer} from "../auth/AuthContext"

export class MainContentPanel extends Component {
	render() {
		return (
			<>
				<TopBar
					button={[
						[<DiscoverButton />, 1],
						[
							<Link to={"admin"}>
								<Button>Go to Manager</Button>
							</Link>,
							6,
							"right"
						]
					]}
				/>
				<Col numColSpan={5} className="h-[101%] overflow-auto">
					<div className="w-full border-none h-max p-4 border-x border-gray-200">
						<NewSensorManager onUpdate={() => this.props.navigate("/")} />
						<Outlet />
					</div>
				</Col>
			</>
		)
	}
}

const MainContentPanelWithLoader = withLoader(MainContentPanel)
export default MainContentPanelWithLoader
