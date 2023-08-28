import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import {useSelector} from "react-redux"
import Login from "./Login"
import Protected from "./protectedContent"

function AppRoutes() {
	var isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

	// Diese Route dient der Authentifizierung von dem Nutzer
	const authRoutes = (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	)

	// Default Routen für den Orchestrator
	const mainRoutes = (
		<>
			<div>
				<Routes>
					<Route path="/" element={<Protected />} />
				</Routes>
			</div>
		</>
	)

	return (
		<Router>
			{!isAuthenticated && authRoutes}
			{isAuthenticated && mainRoutes}
		</Router>
	)
}

export default AppRoutes
//<Route exact path="/" component={} />
//<Route path="/admin/*" element={<AdminCenter />}/>
//{isAuthenticated && adminRoutes}
