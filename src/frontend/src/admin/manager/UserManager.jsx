import {Component} from "react"
import {Callout, Card, List, ListItem, Metric, Title} from "@tremor/react"
import AuthContext from "../../auth/AuthContext"
import logo from "../../assets/logo.svg"
import {ExclamationIcon} from "@heroicons/react/solid"
import {LogoutButton} from "../../auth/Login"

export default class UserManager extends Component {
	static contextType = AuthContext
	render() {
		if (!this.context.auth.admin) {
			return (
				<Callout className={"h-fit m-auto w-1/2"} title="No Permission" icon={ExclamationIcon} color="rose">
					You have no permission to access this manager.
				</Callout>
			)
		}
		return (
			<>
				<Metric>Users</Metric>
				<List>
					<ListItem>
						<Card>
							<Title>User 1</Title>
						</Card>
					</ListItem>
				</List>
			</>
		)
	}
}
