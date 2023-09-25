import {Component} from "react"
import {Button, Card, Col, Grid} from "@tremor/react"
import {SearchIcon} from "@heroicons/react/solid"
import logo from "../assets/logo.svg"
import {discover} from "../api/sensor_api"

export default class TopBar extends Component {
	constructor(props) {
		super(props)
		this.state = {discover: false}
	}

	render() {
		return (
			<Card className="h-[10%]">
				<Grid numCols={10}>
					<Col numColSpan={1}>
						<div className="w-full">
							<img src={logo} alt="YuriSense Logo" />
						</div>
					</Col>
					<Col numColSpan={9} className="ml-4">
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
					</Col>
				</Grid>
			</Card>
		)
	}
}
