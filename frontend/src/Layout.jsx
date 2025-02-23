import { ThemeProvider } from "./context/Theme.jsx";
import { Outlet } from "react-router-dom";
import Header from "./components/Common/Header/Header.jsx";
import Footer from "./components/Common/Footer/Footer.jsx";

export default function Layout() {
	return (
		<ThemeProvider>
			<Header />
			<Outlet />
			<Footer />
		</ThemeProvider>
	);
}
