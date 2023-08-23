import {Component} from "react";
import {Button, Card, Col} from "@tremor/react";
import {getSensorData} from "../../api/api";
import {CogIcon} from "@heroicons/react/solid";
import TemperatureSensor from "./TemperatureSensor";
import DebugSensor from "./DebugSensor";
import LightSensor from "./LightSensor";

export default class SensorCard extends Component {

    constructor(props) {
        super(props);
        this.state = {data: {}};
    }


    componentDidMount() {
        getSensorData(this.props.sensor.uuid).then(data => this.setState({data}));
        this.eventSource = new EventSource("/api/realtime");
        this.eventSource.addEventListener(this.props.sensor.uuid,
            e => {
                const data = JSON.parse(e.data);
                this.setState({data});
            }
        );
    }

    componentWillUnmount() {
        this.eventSource.close();
    }

    render() {
        return <Col>
            <Card className="max-w-lg">
                {(() => {
                    const overviewButton = <Button icon={CogIcon} onClick={() => {
                        this.props.doSelect();
                    }}>Overview</Button>;
                    switch (this.props.sensor.type) {
                        case "temperature":
                            return <TemperatureSensor sensor={this.props.sensor} data={this.state.data}>
                                {overviewButton}
                            </TemperatureSensor>
                        case "light":
                            return <LightSensor sensor={this.props.sensor} data={this.state.data}>
                                {overviewButton}
                            </LightSensor>
                        default:
                            return <DebugSensor sensor={this.props.sensor} data={this.state.data}>
                                {overviewButton}
                            </DebugSensor>
                    }
                })()}
            </Card>
        </Col>
    }
}