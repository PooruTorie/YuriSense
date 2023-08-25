import {Component} from "react"
import {
	Badge,
	Button,
	Callout,
	Card,
	ProgressBar,
	Text,
	TextInput,
	Title
} from "@tremor/react"
import {ArrowCircleUpIcon} from "@heroicons/react/solid"
import {getNewestVersion, setSensorName, updateSensor} from "../../api/api"

export default class SensorSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			update: false,
			updateError: undefined,
			updateLog: [],
			updateProgress: {current: 0, total: 1},
			newestVersion: this.props.sensor.version,
			loading: false,
			nameError: undefined,
			name: this.props.sensor.name,
			speed: this.props.settings.pullSpeed,
			speedError: undefined
		}
	}

	componentDidMount() {
		getNewestVersion(this.props.sensor.type).then((d) =>
			this.setState({newestVersion: d.version})
		)
		this.eventSource = new EventSource("/api/realtime")
		this.eventSource.addEventListener("update_state", (e) => {
			const data = JSON.parse(e.data)
			this.setState({
				updateLog: [...this.state.updateLog, <p>State: {data.state}</p>]
			})
		})
		this.eventSource.addEventListener("update_progress", (e) => {
			const data = JSON.parse(e.data)
			this.setState({
				updateProgress: data
			})
		})
	}

	componentWillUnmount() {
		this.eventSource.close()
	}

	update() {
		if (!this.state.nameError) {
			this.setState({loading: true})
			setSensorName(this.props.sensor.uuid, this.state.name).then(() => {
				this.props.sensor.name = this.state.name
				this.setState({loading: false})
			})
		}
	}

	render() {
		return (
			<Card>
				<Title>Settings</Title>
				<Text>Type: {this.props.sensor.type}</Text>
				{this.state.update || !!this.state.updateError ? (
					<Callout
						className="mt-4 mb-3"
						title={
							!this.state.updateError
								? "Update Log"
								: "Error: " + this.state.updateError
						}
						color={!this.state.updateError ? "teal" : "red"}
					>
						<ProgressBar
							percentageValue={
								(this.state.updateProgress.current * 100) /
								this.state.updateProgress.total
							}
							color="teal"
							className="mt-3"
						/>
						{this.state.updateLog}
					</Callout>
				) : undefined}
				<Text>
					Version: {this.props.sensor.version}
					{this.props.sensor.version !== this.state.newestVersion ? (
						<>
							&nbsp;&nbsp;
							<Badge>Update Available!</Badge>
							&nbsp;&nbsp;
							<Button
								variant="secondary"
								loading={this.state.update}
								icon={ArrowCircleUpIcon}
								onClick={() => {
									this.setState({update: true})
									updateSensor(this.props.sensor.uuid).then(
										(state) => {
											this.setState({
												updateError: state.error,
												update: false
											})
											if (state.success) {
												this.props.sensor.version =
													this.state.newestVersion
											}
										}
									)
								}}
							>
								Update to {this.state.newestVersion}
							</Button>
						</>
					) : undefined}
				</Text>
				<br />
				<Text>Name:</Text>
				<TextInput
					value={this.state.name}
					error={!!this.state.nameError}
					maxLength={20}
					errorMessage={this.state.nameError}
					onChange={(e) =>
						this.setState({
							nameError:
								e.target.value.trim() === ""
									? "Name can not be Empty"
									: undefined,
							name: e.target.value
						})
					}
				/>
				<Text>Update Speed:</Text>
				<TextInput
					value={this.state.speed}
					error={!!this.state.speedError}
					maxLength={20}
					errorMessage={this.state.speedError}
					onChange={(e) => {
						try {
							const v = parseInt(e.target.value)
							this.setState({
								speedError:
									v <= 0 ? "Speed can't be zero or less" : undefined,
								speed: v
							})
						} catch (e) {
							this.setState({
								speedError: "Speed need's to be a Number"
							})
						}
					}}
				/>
				<Button
					className="mt-2"
					disabled={!!this.state.nameError}
					loading={this.state.loading}
					onClick={this.update.bind(this)}
				>
					Apply
				</Button>
			</Card>
		)
	}
}
