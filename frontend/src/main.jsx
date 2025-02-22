import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import User from "./components/User/UserProfile/UserProfile.jsx";

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

console.log("Hello from main.jsx");

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />}>
			<Route path="" element={<Home />} />
			<Route path="users/:id" element={<User />} />
			{/* <Route path="" element={<Home />} />
			<Route path="" element={<Home />} />
			<Route path="" element={<Home />} /> */}
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
