import {Component} from "react"
import TopBar from "./menu/TopBar"
import MainContentPanel from "./main/Root"
import {Card, Metric, Text} from "@tremor/react"
import {AuthConsumer, AuthProvider} from "./auth/AuthContext"
import Login from "./auth/Login"
import {LogoutButton} from "./auth/Login"
import {createBrowserRouter, RouterProvider, useLoaderData, useParams, useNavigate} from "react-router-dom"
import OverviewContentPanel from "./main/overview/SensorOverviewPanel"
import {loader as SensorPanelLoader} from "./main/sensor/SensorPanels"
import {loader as SensorLoader} from "./main/overview/SensorOverviewPanel"
import SensorPanels from "./main/sensor/SensorPanels"

export function withLoader(Component) {
	return (props) => <Component {...props} navigate={useNavigate()} params={useParams()} loaderData={useLoaderData()} />
}

export default class App extends Component {
	render() {
		let router = createBrowserRouter([
			{
				path: "/",
				element: (
					<>
						<TopBar />
						<MainContentPanel />
					</>
				),
				children: [
					{
						index: true,
						loader: SensorPanelLoader,
						element: <SensorPanels />
					},
					{
						path: "sensor/:uuid",
						loader: SensorLoader,
						element: <OverviewContentPanel />
					}
				]
			},
			{
				path: "/admin",
				element: (
					<>
						<AuthProvider login={<Login />}>
							<AuthConsumer>
								{({auth}) => (
									<Card>
										<Metric>{auth.username}</Metric>
										<Text>{auth.email}</Text>
										<LogoutButton>Logout</LogoutButton>
									</Card>
								)}
							</AuthConsumer>
						</AuthProvider>
					</>
				)
			}
		])

		return <RouterProvider router={router} />
	}
}
