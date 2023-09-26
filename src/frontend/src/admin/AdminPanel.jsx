import {Component} from "react"
import {Card, Col, Grid, Metric, Subtitle, Tab, TabList, Text} from "@tremor/react"
import TopBar from "../menu/TopBar"
import SideMenu from "../menu/SideMenu"
import {Outlet} from "react-router-dom"
import {LogoutButton} from "../auth/Login"
import AuthContext from "../auth/AuthContext"

export default class AdminPanel extends Component {
	static contextType = AuthContext
	render() {
		return (
			<>
				<TopBar
					button={[
						[
							<LogoutButton to={"/"} className={"m-auto"}>
								Logout from {this.context.auth.firstName} {this.context.auth.lastName}
							</LogoutButton>,
							2
						],
						[<Subtitle>Email: {this.context.auth.email}</Subtitle>, 3],
						[<Subtitle>Phone: {this.context.auth.phone}</Subtitle>, 3]
					]}
				/>
				<Grid numCols={10} className={"h-[90%]"}>
					<SideMenu numColSpan={1} />
					<Col numColSpan={9} className="overflow-auto">
						<div className="w-full border-none h-max p-4 border-x border-gray-200">
							<Outlet />
						</div>
					</Col>
				</Grid>
			</>
		)
	}
}
