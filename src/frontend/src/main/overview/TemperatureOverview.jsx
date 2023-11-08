import {Card, Grid, LineChart, Metric, Tab, TabList, Title, Col, Subtitle} from "@tremor/react"
import {subDays, subHours, subMinutes} from "date-fns"
import {getSensorDataTimeline} from "../../api/sensor_api"
import RealtimeComponent from "../../utils/RealtimeComponent"

export default class TemperatureOverview extends RealtimeComponent {
	constructor(props) {
		super(props)
		this.state = {chartData: [], filter: "M"}
	}

	componentDidMount() {
		super.componentDidMount()
		getSensorDataTimeline(this.props.sensor.uuid, "temp").then((data) =>
			this.setState({
				chartData: data.map((dataEntry) => {
					dataEntry.timestamp = new Date(dataEntry.timestamp)
					return dataEntry
				})
			})
		)
	}

	componentRealtimeEventSourceMount() {
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

	getFilteredData(period) {
		if (this.state.chartData.length > 0) {
			const lastAvailableDate = this.state.chartData[this.state.chartData.length - 1].timestamp
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
				let data = this.state.chartData.filter(
					(item) => item.timestamp >= periodStartDate && item.timestamp <= lastAvailableDate
				)
				let multiDay = false,
					lastDay
				for (const item of data) {
					if (lastDay) {
						if (lastDay.timestamp.getDate() !== item.timestamp.getDate()) {
							multiDay = true
							break
						}
					}
					lastDay = item
				}
				return [data, multiDay]
			} else {
				return [this.state.chartData, true]
			}
		}
		return [[], false]
	}

	render() {
		let [filteredData, multiDay] = this.getFilteredData(this.state.filter)
		filteredData = filteredData.map((item) => {
			return {
				Time: multiDay ? item.timestamp.toLocaleString() : item.timestamp.toLocaleTimeString(),
				Temperature: item.value
			}
		})
		let max = null
		let average = null
		if (filteredData.length > 0) {
			let sum = 0
			for (let i = 0; i < filteredData.length; i++) {
				sum += parseFloat(filteredData[i].Temperature)
				console.log(sum)
			}

			average = Math.round(sum / filteredData.length)

			max = parseFloat(filteredData[0].Temperature)
			for (let i = 1; i < parseFloat(filteredData.length); i++) {
				if (parseFloat(filteredData[i].Temperature) > max) {
					max = parseFloat(filteredData[i].Temperature)
				}
			}
		}
		return (
			<Card>
				<Grid className="mb-9" numCols={3}>
					<Col>
						<Subtitle className="flex justify-center">CurrentTemp</Subtitle>
					</Col>

					<Col>
						<Subtitle className="flex justify-center">AverageTemp</Subtitle>
					</Col>

					<Col>
						<Subtitle className="flex justify-center">MaxTemp</Subtitle>
					</Col>
					<Col>
						<Metric className="flex justify-center">
							{filteredData.length > 0 ? filteredData[filteredData.length - 1].Temperature : null}
							°C
						</Metric>
					</Col>

					<Col>
						<Metric className="flex justify-center">
							{average}
							°C
						</Metric>
					</Col>

					<Col>
						<Metric className="flex justify-center">
							{max}
							°C
						</Metric>
					</Col>
				</Grid>
				<Title className="underline">Temperature Chart</Title>
				<TabList
					defaultValue={this.state.filter}
					onValueChange={(value) => this.setState({filter: value})}
					className="mt-2"
				>
					<Tab value="M" text="Minute" />
					<Tab value="H" text="Hour" />
					<Tab value="D" text="Day" />
					<Tab value="W" text="Week" />
					<Tab value="A" text="All" />
				</TabList>
				<LineChart
					className="mt-6"
					data={filteredData}
					index="Time"
					categories={["Temperature"]}
					colors={["blue"]}
					showAnimation={false}
					showLegend={false}
					showGradient={true}
					valueFormatter={(v) => Intl.NumberFormat("de", {unit: "celsius", style: "unit"}).format(v).toString()}
					minValue={-30}
					maxValue={60}
				/>
			</Card>
		)
	}
}
