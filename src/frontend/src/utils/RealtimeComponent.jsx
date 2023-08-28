import {Component} from "react"

export default class RealtimeComponent extends Component {
	eventSource: EventSource

	componentDidMount() {
		this.eventSource = new EventSource("/api/realtime")
		this.componentRealtimeEventSourceMount()
	}

	componentWillUnmount() {
		if (this.eventSource) {
			this.eventSource.close()
		}
	}

	componentRealtimeEventSourceMount() {}
}
