import {Component} from "react"
import {Card, List, ListItem, Metric, Table, Title} from "@tremor/react"

export default class RackManager extends Component {
	render() {
		return (
			<>
				<Metric>Racks</Metric>
				<List>
					<ListItem>
						<Card>
							<Title>Rack 1</Title>
						</Card>
					</ListItem>
				</List>
			</>
		)
	}
}
