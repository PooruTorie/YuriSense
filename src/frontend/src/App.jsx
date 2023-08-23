import {Component} from "react";
import TopBar from "./menu/TopBar";
import MainContentPanel from "./main/MainContentPanel";

export default class App extends Component {

    render() {
        return <>
            <TopBar/>
            <MainContentPanel/>
        </>
        /*
        return <>
            <TopBar/>
            <Grid numCols={6} className="h-[86%]">
                <SideMenu/>
                <MainContentPanel/>
            </Grid>
        </>
         */
    }

}