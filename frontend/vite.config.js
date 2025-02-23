import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the mode (development, production, etc.)
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [react(), tailwindcss()],
		server: {
			host: env.VITE_HOST || "localhost", // Example usage
			port: env.VITE_PORT || 5173,
		},
	};
});
