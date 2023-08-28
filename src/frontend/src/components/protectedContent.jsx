import React, {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import TopBar from "../menu/TopBar"
import MainContentPanel from "../main/MainContentPanel"
import {Grid} from "@tremor/react"
import SideMenu from "../menu/SideMenu"

function ProtectedContent() {
	const dispatch = useDispatch()

	return (
		<div className="" id="">
			<h1>Protected Content</h1>
			<p>This is protected Contend, so your only able to view this if your logged in.</p>
			<>
				<TopBar />
				<Grid numCols={6} className="h-[86%]">
					<SideMenu />
					<MainContentPanel />
				</Grid>
			</>
		</div>
	)
}

export default ProtectedContent
//<p>{user ? JSON.stringify(user) : 'Loading user data...'}</p>
