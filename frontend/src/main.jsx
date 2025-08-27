import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import FollowersFollowing from "./pages/ FollowersFollowing/ FollowersFollowing.jsx";
import Noties from "./pages/Noties/Noties.jsx";
import Bookmarks from "./pages/Bookmarks/Bookmarks.jsx";
import Comments from "./pages/Comments/Comments.jsx";
import MyProfileLayout from "./pages/MyProfile/MyProfileLayout.jsx";

import UserProfileLayout from "./pages/UserProfile/UserProfileLayout.jsx";
import CreatePost from "./pages/CreatePost/CreatePost.jsx";

import Login from "./components/Auth/Login/Login.jsx";

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
// import FollowersFollowing from "./pages/ FollowersFollowing/ FollowersFollowing.jsx";

import { registerSW } from "virtual:pwa-register";

// Register the service worker
registerSW({
	immediate: true,
	onNeedRefresh() {
		console.log("New version available, reload to update.");
	},
	onOfflineReady() {
		console.log("App ready to work offline!");
	},
});

console.log("Hello from main.jsx");

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />}>
			<Route path="" element={<Home />}>
				<Route path="post/:postId/comments" element={<Comments />} />
			</Route>
			<Route path="/my/channel/:userName" element={<MyProfileLayout />} />
			<Route path="/users/channel/:userName" element={<UserProfileLayout />} />
			<Route path="create-post" element={<CreatePost />} />

			<Route path="followers" element={<FollowersFollowing />} />

			<Route path="bookmarks" element={<Bookmarks />} />
			<Route path="notifications" element={<Noties />} />

			{/* <Route path="signup" element={<Signup />} /> */}
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
