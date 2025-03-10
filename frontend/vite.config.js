import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the mode (development, production, etc.)
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [react(), tailwindcss()],

		server: {
			https: {
				key: fs.readFileSync("key.pem"),
				cert: fs.readFileSync("cert.pem"),
			},
			host: env.VITE_HOST || "localhost",
			port: env.VITE_PORT || 5173,
		},
	};
});
