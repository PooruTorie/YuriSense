import {Component} from "react"
import {Callout, Card, Col, Grid, Metric, Subtitle, Tab, TabList, Text} from "@tremor/react"
import TopBar from "../menu/TopBar"
import SideMenu from "../menu/SideMenu"
import {Link, Outlet} from "react-router-dom"
import {LogoutButton} from "../auth/Login"
import AuthContext from "../auth/AuthContext"
import logo from "../assets/logo.svg"
import {ExclamationIcon} from "@heroicons/react/solid"

export default class AdminPanel extends Component {
	static contextType = AuthContext
	render() {
		const isApplication = window.navigator.userAgent.includes("yurisense-application")
		if (isApplication) {
			if (!this.context.auth.admin) {
				return (
					<>
						<img className={"w-[20%] mt-32 mb-10 m-auto"} src={logo} alt="YuriSense Logo" />
						<div>
							<Callout
								className={"h-fit m-auto w-1/2"}
								title="No Permission"
								icon={ExclamationIcon}
								color="rose"
							>
								You can only use this Application as Admin.
							</Callout>
							<div className={"text-center"}>
								<LogoutButton className={"mt-6"}>Logout</LogoutButton>
							</div>
						</div>
					</>
				)
			}
		}
		let managers = [
			{value: "/racks", text: "Racks"},
			{value: "/sensors", text: "Sensors"}
		]
		if (this.context.auth.admin) {
			managers.push({value: "/users", text: "Users"})
		}
		return (
			<>
				<TopBar
					button={[
						[
							<LogoutButton to={isApplication ? undefined : "/"} className={"m-auto"}>
								Logout from {this.context.auth.firstName} {this.context.auth.lastName}
							</LogoutButton>,
							2
						],
						[<Subtitle>Email: {this.context.auth.email}</Subtitle>, 3],
						[<Subtitle>Phone: {this.context.auth.phone}</Subtitle>, 3]
					]}
				/>
				<Grid numCols={10} className={"h-[90%]"}>
					<SideMenu numColSpan={1} managers={managers} />
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
