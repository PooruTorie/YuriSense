import {Component} from "react"
import TopBar from "./menu/TopBar"
import MainContentPanel from "./main/MainContentPanel"
import {Grid} from "@tremor/react"
import SideMenu from "./menu/SideMenu"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import {store, persistor} from "./components/store"
import AppRoutes from "./components/routes"
export default class App extends Component {
	render() {
		/*
        return <>
            <TopBar/>
            <MainContentPanel/>
        </>
        */

		return (
			<>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<AppRoutes />
					</PersistGate>
				</Provider>
			</>
		)
	}
}
