import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import Placements from "./pages/Placements/Placements.jsx";
import Hackathons from "./pages/Hackathons/Hackathons.jsx";
import Exams from "./pages/Exams/Exams.jsx";
import LostFound from "./pages/LostFound/LostFound.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
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
			<Route path="placements" element={<Placements />} />
			<Route path="exams" element={<Exams />} />
			<Route path="hackathons" element={<Hackathons />} />
			<Route path="lostandfound" element={<LostFound />} />
			<Route path="login" element={<Login />} />
			<Route path="signup" element={<SignUp />} />
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
