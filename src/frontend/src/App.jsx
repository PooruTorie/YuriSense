import {Component} from "react"
import TopBar from "./menu/TopBar"
import MainContentPanel from "./main/MainContentPanel"
import {Button, Card, Grid, Metric, Text} from "@tremor/react"
import SideMenu from "./menu/SideMenu"
import {AuthConsumer, AuthProvider} from "./auth/AuthContext"
import Login from "./auth/Login"
import {LogoutButton} from "./auth/Login"
export default class App extends Component {
	render() {
		return (
			<>
				<TopBar />
				<MainContentPanel />
			</>
		)
		/*
		return (
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
		 */
	}
}
