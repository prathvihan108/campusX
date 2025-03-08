import { ThemeProvider } from "./context/Theme.jsx";
import { Outlet } from "react-router-dom";
import Header from "./components/Common/Header/Header.jsx";
import Footer from "./components/Common/Footer/Footer.jsx";
import PostContextProvider from "./context/PostContextProvider.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<PostContextProvider>
					<Header />
					<ToastContainer />
					<Outlet />
					<Footer />
				</PostContextProvider>
			</ThemeProvider>
		</AuthProvider>
	);
}
