import {Component} from "react"
import {Link} from "react-router-dom"
import logo from "../assets/logo.svg"
import {Button, Callout, Card, Subtitle, TextInput} from "@tremor/react"
import {ExclamationIcon} from "@heroicons/react/solid"
import {ClipLoader, MoonLoader} from "react-spinners"

export default class LoadingPanel extends Component {
	render() {
		return (
			<>
				<img className={"w-[20%] mt-32 mb-10 m-auto"} src={logo} alt="YuriSense Logo" />
				<MoonLoader className={"m-auto mt-32"} color={"#d4181f"} size={120} speedMultiplier={0.5} />
			</>
		)
	}
}
