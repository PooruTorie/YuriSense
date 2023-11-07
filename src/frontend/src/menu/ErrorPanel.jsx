import {Component} from "react"
import TopBar, {DiscoverButton} from "./TopBar"
import {Link} from "react-router-dom"
import {Button, Callout, Col, Metric} from "@tremor/react"
import {withLoader} from "../App"
import {ExclamationIcon} from "@heroicons/react/solid"

export class ErrorPanel extends Component {
	render() {
		console.error(this.props.loaderError)
		return (
			<>
				<TopBar
					button={[
						[
							<Link to={"/"}>
								<Button>Main Page</Button>
							</Link>,
							6,
							"right"
						]
					]}
				/>
				<Col numColSpan={5} className="h-[101%] overflow-auto">
					<div className="border-none h-max p-4 border-x border-gray-200">
						<Callout title="Error" icon={ExclamationIcon} color="rose">
							The Site has encountered an Error
						</Callout>
					</div>
				</Col>
			</>
		)
	}
}

const ErrorPanelWithLoader = withLoader(ErrorPanel)
export default ErrorPanelWithLoader
