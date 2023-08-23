import {Component} from "react";
import {Card, Col, Tab, TabList} from "@tremor/react";

export default class SideMenu extends Component {

    render() {
        return <Col className="h-[100%]">
            <Card className="mt-3 h-full">
                <TabList defaultValue={"test1"} className="flex-col border-0">
                    <Tab value={"test1"} text={"Test"} className="!ml-0"/>
                    <Tab value={"test2"} text={"Test"} className="!ml-0"/>
                </TabList>
            </Card>
        </Col>
    }

}