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
import User from "./components/User/User";
import UserContextProvider from "./context/UserContext";

function App() {
	return (
		<UserContextProvider>
			<h1></h1>
		</UserContextProvider>
	);
}

export default App;
