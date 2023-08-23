import {Component} from "react";
import {Flex, Text} from "@tremor/react";

export default class DebugSensor extends Component {

    render() {
        return <>
            <Flex justifyContent="end" className="mb-3">
                {this.props.children}
            </Flex>
            <Flex className="text-left">
                <Text className="whitespace-pre-wrap">{JSON.stringify(this.props.sensor, null, 4)}</Text>
            </Flex>
            <Flex className="text-left">
                <Text className="whitespace-pre-wrap">{JSON.stringify(this.props.data, null, 4)}</Text>
            </Flex>
        </>
    }

}