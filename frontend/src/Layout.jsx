import React from "react";
import Header from "./components/Common/Header/Header.jsx";
import Footer from "./components/Common/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}

export default Layout;
