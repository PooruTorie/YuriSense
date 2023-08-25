import {Component} from "react"
import {Card, Col, Grid, LineChart, Metric, Title} from "@tremor/react"
import {addHours, subDays, subHours, subMinutes} from "date-fns"
import SensorSettings from "./SensorSettings"
import {getSensorDataTimeline} from "../../api/api"

export default class TemperatureOverview extends Component {
	constructor(props) {
		super(props)
		this.state = {chartData: [], filter: "Max"}
	}

	componentDidMount() {
		getSensorDataTimeline(this.props.sensor.uuid, "temp").then((data) =>
			this.setState({
				chartData: data.map((dataEntry) => {
					dataEntry.timestamp = addHours(new Date(dataEntry.timestamp), 2)
					return dataEntry
				})
			})
		)
		this.eventSource = new EventSource("/api/realtime")
		this.eventSource.addEventListener(this.props.sensor.uuid, (e) => {
			this.setState({
				chartData: [
					...this.state.chartData,
					{
						timestamp: new Date(),
						value: JSON.parse(e.data).temp
					}
				]
			})
		})
	}

	componentWillUnmount() {
		this.eventSource.close()
	}

	getFilteredData(period) {
		if (this.state.chartData.length > 0) {
			const lastAvailableDate =
				this.state.chartData[this.state.chartData.length - 1].timestamp
			let periodStartDate = null
			switch (period) {
				case "M":
					periodStartDate = subMinutes(lastAvailableDate, 1)
					break
				case "H":
					periodStartDate = subHours(lastAvailableDate, 1)
					break
				case "D":
					periodStartDate = subDays(lastAvailableDate, 1)
					break
				case "W":
					periodStartDate = subDays(lastAvailableDate, 7)
					break
			}
			if (periodStartDate) {
				return this.state.chartData.filter(
					(item) =>
						item.timestamp >= periodStartDate &&
						item.timestamp <= lastAvailableDate
				)
			} else {
				return this.state.chartData
			}
		}
		return []
	}

	render() {
		const filteredData = this.getFilteredData(this.state.filter).map(
			(dataEntry) => {
				dataEntry.timestamp = dataEntry.timestamp.toLocaleString()
				return dataEntry
			}
		)
		return (
			<Grid className="mt-6" numCols="2">
				<Col className="m-2">
					<Card>
						<Title>
							<Metric>
								{filteredData.length > 0
									? filteredData[filteredData.length - 1].value
									: null}
								°C
							</Metric>
							Temperature Chart
						</Title>
						{/*
                    <TabList
                        defaultValue={this.state.filter}
                        onValueChange={value => this.setState({filter: value})}
                        className="mt-10"
                    >
                        <Tab value="M" text="Minute"/>
                        <Tab value="H" text="Hour"/>
                        <Tab value="D" text="Day"/>
                        <Tab value="W" text="Week"/>
                        <Tab value="Max" text="Max"/>
                    </TabList>
                    */}
						<LineChart
							className="mt-6"
							data={filteredData}
							index="timestamp"
							categories={["value"]}
							colors={["blue"]}
							showAnimation={true}
							showLegend={false}
							showGradient={true}
							valueFormatter={this.dataFormatter}
							minValue={-30}
							maxValue={60}
						/>
					</Card>
				</Col>
				<Col className="m-2">
					<SensorSettings
						sensor={this.props.sensor}
						settings={this.props.settings}
					/>
				</Col>
			</Grid>
		)
	}
}
