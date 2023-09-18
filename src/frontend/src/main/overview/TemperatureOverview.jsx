import {Card, Col, Grid, LineChart, Metric, Tab, TabList, Title} from "@tremor/react"
import {addHours, subDays, subHours, subMinutes} from "date-fns"
import SensorSettings from "./SensorSettings"
import {getSensorDataTimeline} from "../../api/api"
import RealtimeComponent from "../../utils/RealtimeComponent"
import {remap} from "../../utils/MathUtils"

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
				return this.state.chartData.filter(
					(item) => item.timestamp >= periodStartDate && item.timestamp <= lastAvailableDate
				)
			} else {
				return this.state.chartData
			}
		}
		return []
	}

	render() {
		let filteredData = this.getFilteredData(this.state.filter)
		let lastValue
		filteredData = filteredData.reduce((data, value) => {
			if (lastValue) {
				const lastValueTime = lastValue.timestamp.getTime() / 60000
				const valueTime = value.timestamp.getTime() / 60000
				for (let i = lastValueTime + 1; i <= valueTime; i++) {
					const x = remap(i, lastValueTime, valueTime, 0, 1)
					const y = (Math.cos(Math.PI * x) + 1) / 2
					data.push({
						Time: new Date(i * 60000).toLocaleTimeString(),
						Temperature: remap(y, 1, 0, lastValue.value, value.value)
					})
				}
			} else {
				data.push({
					Time: value.timestamp.toLocaleTimeString(),
					Temperature: value.value
				})
			}
			lastValue = value
			return data
		}, [])

		console.log(filteredData)
		return (
			<Card>
				<Title>
					<Metric>
						{filteredData.length > 0 ? filteredData[filteredData.length - 1].Temperature : null}
						°C
					</Metric>
					Temperature Chart
				</Title>
				<TabList
					defaultValue={this.state.filter}
					onValueChange={(value) => this.setState({filter: value})}
					className="mt-10"
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
