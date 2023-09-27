import {Component} from "react"
import {Card, Col, Tab, TabList} from "@tremor/react"
import {withLoader} from "../App"
import {Navigate} from "react-router-dom"

class SideMenu extends Component {
	render() {
		let defaultPath = this.props.location.pathname.replace("/admin", "")
		if (!this.props.managers.map((e) => e.value).includes(defaultPath)) {
			return <Navigate replace to={"/admin" + this.props.managers[0].value} />
		}
		return (
			<Col className="h-[100%]" {...this.props}>
				<Card className="mt-3 h-full">
					<TabList
						defaultValue={defaultPath}
						onValueChange={(v) => this.props.navigate("/admin" + v)}
						className="flex-col border-0"
					>
						{this.props.managers.map((manager) => (
							<Tab {...manager} className="!ml-0" />
						))}
					</TabList>
				</Card>
			</Col>
		)
	}
}

const SideMenuWithLoader = withLoader(SideMenu)
export default SideMenuWithLoader
