import {Component} from "react";
import {Button, Flex} from "@tremor/react";
import {XIcon} from "@heroicons/react/solid";
import TemperatureOverview from "./TemperatureOverview";
import {getSensorSettings} from "../../api/api";

export default class OverviewContentPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {settings: undefined};
    }

    componentDidMount() {
        getSensorSettings(this.props.sensor.uuid).then(d => this.setState({settings: d}));
    }

    render() {
        return <>
            <Flex className="m-2" justifyContent="end">
                <Button icon={XIcon} color={"red"} onClick={() => {
                    this.props.onClose();
                }}>Close</Button>
            </Flex>
            <TemperatureOverview sensor={this.props.sensor} settings={this.state.settings}/>
        </>;
    }
}