import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import ChatBot from "./pages/ChatBot/ChatBot.jsx";
import Noties from "./pages/Noties/Noties.jsx";
import Bookmarks from "./pages/Bookmarks/Bookmarks.jsx";

import Login from "./components/Auth/Login/Login.jsx";

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
			<Route path="chatbot" element={<ChatBot />} />
			<Route path="bookmarks" element={<Bookmarks />} />
			<Route path="notifications" element={<Noties />} />

			<Route path="login" element={<Login />} />
			{/* <Route path="signup" element={<Signup />} /> */}
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
