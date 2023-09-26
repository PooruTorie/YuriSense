import {Component} from "react"
import {Card, Col, Tab, TabList} from "@tremor/react"
import {withLoader} from "../App"
import {Navigate, NavLink} from "react-router-dom"

class SideMenu extends Component {
	render() {
		const managers = [
			{value: "/racks", text: "Racks"},
			{value: "/sensors", text: "Sensors"},
			{value: "/users", text: "Users"}
		]
		let defaultPath = this.props.location.pathname.replace("/admin", "")
		if (!managers.map((e) => e.value).includes(defaultPath)) {
			return <Navigate replace to={"/admin" + managers[0].value} />
		}
		return (
			<Col className="h-[100%]" {...this.props}>
				<Card className="mt-3 h-full">
					<TabList defaultValue={defaultPath} className="flex-col border-0">
						{managers.map((manager) => (
							<NavLink to={"/admin" + manager.value} className="!ml-0">
								<Tab {...manager} />
							</NavLink>
						))}
					</TabList>
				</Card>
			</Col>
		)
	}
}

const SideMenuWithLoader = withLoader(SideMenu)
export default SideMenuWithLoader
