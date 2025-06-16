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
					<div className="min-h-screen flex flex-col">
						<Header />
						<main className="flex-1 pt-25 pb-20">
							<ToastContainer />
							<LoadingModel />
							<LikeNotification />
							<Outlet />
						</main>
						<Footer />
					</div>
				</PostContextProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}
