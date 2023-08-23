import {Component} from "react";
import {Flex, Metric, ProgressBar, Text} from "@tremor/react";

export default class LightSensor extends Component {

    render() {
        return <>
            <Flex className="text-center">
                <Text className="w-full">{this.props.sensor.name}</Text>
                {this.props.children}
            </Flex>
            <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-1"
            >
                <Metric>{Math.round(this.props.data.light / 2000 * 100)}</Metric>
                <Text>%</Text>
            </Flex>
            <ProgressBar color="yellow" percentageValue={this.props.data.light / 2000 * 100}/>
        </>
    }

}