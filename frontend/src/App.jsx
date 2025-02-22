import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Navbar from "./components/Navbar";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";

function App() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/posts")
			.then((response) => setPosts(response.data))
			.catch((error) => console.error("Error fetching posts:", error));
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home posts={posts} />} />
					<Route path="/category/:category" element={<Category />} />
					<Route path="/post/:id" element={<PostDetail />} />
					<Route path="/create" element={<CreatePost />} />
					<Route path="/profile/:userId" element={<Profile />} />
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
