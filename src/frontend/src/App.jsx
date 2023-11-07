import {Component, lazy, Suspense} from "react"
import {
	createBrowserRouter,
	RouterProvider,
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
	useRouteError
} from "react-router-dom"
import OverviewContentPanel, {loader as SensorLoader} from "./main/overview/SensorOverviewPanel"
import SensorPanels, {loader as SensorPanelLoader} from "./main/sensor/SensorPanels"
import Login from "./auth/Login"
import {AuthProvider} from "./auth/AuthContext"
import SensorManager from "./admin/manager/SensorManager"
import UserManager from "./admin/manager/UserManager"
import LoadingPanel from "./main/LoadingPanel"
import InitUserManager from "./menu/InitUserManager"
import ErrorPanel from "./menu/ErrorPanel"

export function withLoader(Component) {
	return (props) => (
		<Component
			{...props}
			navigate={useNavigate()}
			location={useLocation()}
			params={useParams()}
			loaderData={useLoaderData()}
			loaderError={useRouteError()}
		/>
	)
}

const MainContentPanel = lazy(() => import("./main/MainContentPanel"))
const AdminPanel = lazy(() => import("./admin/AdminPanel"))

export default class App extends Component {
	render() {
		let router = createBrowserRouter([
			{
				path: "/",
				element: (
					<Suspense fallback={<LoadingPanel />}>
						<MainContentPanel />
					</Suspense>
				),
				errorElement: <ErrorPanel />,
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
					<AuthProvider login={<Login />}>
						<Suspense fallback={<LoadingPanel />}>
							<AdminPanel />
						</Suspense>
					</AuthProvider>
				),
				errorElement: <ErrorPanel />,
				children: [
					/**
					{
						path: "racks",
						element: <RackManager />
					},
						**/
					{
						path: "sensors",
						element: <SensorManager />
					},
					{
						path: "users",
						element: <UserManager />
					}
				]
			}
		])

		return (
			<>
				<InitUserManager />
				<RouterProvider router={router} />
			</>
		)
	}
}
