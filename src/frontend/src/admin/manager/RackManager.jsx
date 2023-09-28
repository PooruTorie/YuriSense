import {Component} from "react"
import {Button, Card, List, ListItem, Metric, Table, Title} from "@tremor/react"
import {getRacks} from "../../api/rack_api"
import {PlusIcon} from "@heroicons/react/solid"

export default class RackManager extends Component {
	constructor(props) {
		super(props)
		this.state = {racks: [], addModalOpen: false}
	}

	componentDidMount() {
		getRacks().then((racks) => this.setState({racks}))
	}

	render() {
		return (
			<>
				<Metric>Racks</Metric>
				<Button icon={PlusIcon} onClick={() => this.setState({addModalOpen: true})}>
					Add
				</Button>
				<List>
					{this.state.racks.map((rack) => (
						<ListItem>
							<Card>
								<Title>{rack.name}</Title>
							</Card>
						</ListItem>
					))}
				</List>
			</>
		)
	}
}
