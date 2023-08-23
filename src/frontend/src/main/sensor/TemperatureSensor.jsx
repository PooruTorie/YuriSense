import {Component} from "react";
import {CategoryBar, Flex, Metric, Text} from "@tremor/react";
import {remap} from "../../utils/MathUtils";

export default class TemperatureSensor extends Component {

    dataFormatter(number: number) {
        return `${Intl.NumberFormat("de").format(number / 2000 * 100).toString()} %`;
    }

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
                <Metric>{this.props.data.temp}</Metric>
                <Text>°C</Text>
            </Flex>
            <CategoryBar
                categoryPercentageValues={[25, 15, 15, 25, 25]}
                showLabels={false}
                showAnimation={true}
                colors={["blue", "green", "yellow", "orange", "red"]}
                percentageValue={remap(this.props.data.temp, -10, 50, 0, 100)}
                className="mt-2"
            />
        </>
    }

}