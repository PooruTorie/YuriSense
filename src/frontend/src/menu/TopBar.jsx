import {Component} from "react"
import {Button, Card, Col, Grid} from "@tremor/react"
import {SearchIcon} from "@heroicons/react/solid"
import logo from "../assets/logo.svg"
import {discover} from "../api/sensor_api"

export default class TopBar extends Component {
	render() {
		const buttonSpan = Math.floor(8 / this.props.button.length)
		return (
			<Card className="h-[10%] inline-table">
				<Grid numCols={10}>
					<Col numColSpan={2}>
						<img className={"w-[60%] m-auto"} src={logo} alt="YuriSense Logo" />
					</Col>
					{this.props.button.map((b) => (
						<Col numColSpan={b[1] || buttonSpan} className={"ml-4 text-" + (b[2] || "center")}>
							{b[0]}
						</Col>
					))}
				</Grid>
			</Card>
		)
	}
}

export class DiscoverButton extends Component {
	constructor(props) {
		super(props)
		this.state = {discover: false}
	}

	render() {
		return (
			<Button
				loading={this.state.discover}
				icon={SearchIcon}
				onClick={() => {
					this.setState({discover: true})
					discover().then(() => {
						this.setState({discover: false})
					})
				}}
			>
				Discover New Devices
			</Button>
		)
	}
}
