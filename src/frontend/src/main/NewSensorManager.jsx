import {Component} from "react";
import {Button, Card, Metric, Table, TableBody, TableHead, TableHeaderCell, TableRow, TextInput} from "@tremor/react";
import {getNewSensorUUIDs, setSensorName} from "../api/api";

class AddNewSensor extends Component {

    constructor(props) {
        super(props);
        this.state = {name: props.name || "", error: null, loading: false, show: true};
    }

    render() {
        if (this.state.show) {
            return <TableRow>
                <TableHeaderCell className="align-middle">{this.props.uuid}</TableHeaderCell>
                <TableHeaderCell>
                    <TextInput error={this.state.error !== null} errorMessage={this.state.error}
                               value={this.state.name} placeholder="Name"
                               onChange={event => this.setState({name: event.target.value})}/>
                </TableHeaderCell>
                <TableHeaderCell>
                    <Button loading={this.state.loading}
                            onClick={() => {
                                this.setState({loading: true});
                                setSensorName(this.props.uuid, this.state.name.trim())
                                    .then(res => {
                                        if (res.error) {
                                            this.setState({loading: false, error: res.error})
                                        } else {
                                            this.setState({show: false});
                                            this.props.onRemove();
                                        }
                                    });
                            }}>
                        Register
                    </Button>
                </TableHeaderCell>
            </TableRow>
        }
        return <></>;
    }
}

export default class NewSensorManager extends Component {

    constructor(props) {
        super(props);
        this.state = {sensors: []};
    }


    componentDidMount() {
        getNewSensorUUIDs().then(sensors => this.setState({sensors}));
        this.eventSource = new EventSource("/api/realtime");
        this.eventSource.addEventListener("new",
            e => this.setState({sensors: [...this.state.sensors, e.data]})
        );
    }

    componentWillUnmount() {
        this.eventSource.close();
    }

    render() {
        if (this.state.sensors.length > 0) {
            return <Card className="my-6 w-full" decoration="bottom" decorationColor="amber">
                <Metric>New Sensors Found</Metric>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>UUID</TableHeaderCell>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell></TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.sensors.map(uuid => <AddNewSensor key={uuid} uuid={uuid} onRemove={() => {
                            this.setState({sensors: this.state.sensors.filter(v => v !== uuid)});
                            this.props.onUpdate();
                        }}/>)}
                    </TableBody>
                </Table>
            </Card>
        }
        return <></>;
    }
}