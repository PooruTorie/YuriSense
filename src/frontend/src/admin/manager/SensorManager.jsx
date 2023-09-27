import {Component} from "react"
import {Card, List, ListItem, Metric, Title} from "@tremor/react"

export default class SensorManager extends Component {
	render() {
		return (
			<>
				<Metric>Sensors</Metric>
				<List>
					<ListItem>
						<Card>
							<Title>Sensor 1</Title>
						</Card>
					</ListItem>
				</List>
			</>
		)
	}
}
