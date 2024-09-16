import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const AdminDashboard = Loadable(lazy(() => import("../pages/admindashboard")));
const Customer = Loadable(lazy(() => import("../pages/customer")));
const CreateCustomer = Loadable(lazy(() => import("../pages/customer/create")));
const EditCustomer = Loadable(lazy(() => import("../pages/customer/edit")));

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
	const userID = localStorage.getItem("id") ?? "0";

	return {
		path: userID == "999" ? "/" : "/",
		element: isLoggedIn ? <FullLayout /> : <MainPages />,
		children: [
			{
				path: "/",
				element: userID == "999" ? <AdminDashboard /> : <Dashboard />,
			},
			// {
			// 	path: "/",
			// 	element: <AdminDashboard />,
			// },
			{
				path: "/customer",
				children: [
					{
						path: "/customer",
						element: <Customer />,
					},
					{
						path: "/customer/create",
						element: <CreateCustomer />,
					},
					{
						path: "/customer/edit/:id",
						element: <EditCustomer />,
					},
				],
			},
		],
	};
};

export default AdminRoutes;