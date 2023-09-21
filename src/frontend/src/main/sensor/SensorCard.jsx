import {Button, Card, CategoryBar, Col, Flex, Metric, Text} from "@tremor/react"
import {getSensorData} from "../../api/api"
import {CogIcon} from "@heroicons/react/solid"
import {remap} from "../../utils/MathUtils"
import RealtimeComponent from "../../utils/RealtimeComponent"
import {Link} from "react-router-dom"

export default class SensorCard extends RealtimeComponent {
	constructor(props) {
		super(props)
		this.state = {data: {}}
	}

	componentDidMount() {
		super.componentDidMount()
		getSensorData(this.props.sensor.uuid).then((data) => this.setState({data}))
	}

	componentRealtimeEventSourceMount() {
		this.eventSource.addEventListener(this.props.sensor.uuid, (e) => {
			const data = JSON.parse(e.data)
			this.setState({data})
		})
	}

	render() {
		return (
			<Col>
				<Card className="max-w-lg">
					<Flex className="text-center">
						<Text className="w-full">{this.props.sensor.name}</Text>
						<Link to={"sensor/" + this.props.sensor.uuid}>
							<Button icon={CogIcon}>Overview</Button>
						</Link>
					</Flex>
					<Flex justifyContent="start" alignItems="baseline" className="space-x-1">
						<Metric>{this.state.data.temp}</Metric>
						<Text>°C</Text>
					</Flex>
					<CategoryBar
						categoryPercentageValues={[25, 15, 15, 25, 25]}
						showLabels={false}
						showAnimation={true}
						colors={["blue", "green", "yellow", "orange", "red"]}
						percentageValue={remap(this.state.data.temp, -10, 50, 0, 100)}
						className="mt-2"
					/>
				</Card>
			</Col>
		)
	}
}
