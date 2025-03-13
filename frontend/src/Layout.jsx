import { ThemeProvider } from "./context/Theme.jsx";
import { Outlet } from "react-router-dom";
import Header from "./components/Common/Header/Header.jsx";
import Footer from "./components/Common/Footer/Footer.jsx";
import PostContextProvider from "./context/PostContextProvider.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LikeNotification from "./components/Notifications/likeNotification.js";
import LoadingModel from "./components/Common/Loading/LoadingModel.jsx";

export default function Layout() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<PostContextProvider>
					<Header />
					<ToastContainer />
					<LoadingModel />
					<LikeNotification />
					<Outlet />
					<Footer />
				</PostContextProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}
