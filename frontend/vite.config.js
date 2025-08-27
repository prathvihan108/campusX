import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the mode (development, production, etc.)
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [
			react(),
			tailwindcss(),
			VitePWA({
				registerType: "autoUpdate",
				manifest: {
					name: "CampusX",
					short_name: "CampusX",
					description: "CampusX - Your Campus Social Network",
					theme_color: "#0f172a",
					background_color: "#ffffff",
					display: "standalone",
					orientation: "portrait",
					start_url: "/",
					icons: [
						{
							src: "/icons/icon-192x192.png",
							sizes: "192x192",
							type: "image/png",
						},
						{
							src: "/icons/icon-512x512.png",
							sizes: "512x512",
							type: "image/png",
						},
						{
							src: "/icons/icon-512x512.png",
							sizes: "512x512",
							type: "image/png",
							purpose: "any maskable",
						},
					],
				},
				workbox: {
					runtimeCaching: [
						{
							urlPattern: ({ request }) => request.destination === "document",
							handler: "NetworkFirst",
							options: {
								cacheName: "html-cache",
							},
						},
						{
							urlPattern: ({ request }) =>
								["style", "script", "worker"].includes(request.destination),
							handler: "StaleWhileRevalidate",
							options: {
								cacheName: "assets-cache",
							},
						},
						{
							urlPattern: ({ request }) => request.destination === "image",
							handler: "CacheFirst",
							options: {
								cacheName: "image-cache",
								expiration: {
									maxEntries: 50,
									maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
								},
							},
						},
					],
				},
			}),
		],

		//to enable https
		// server: {
		// 	https: {
		// 		key: fs.readFileSync("key.pem"),
		// 		cert: fs.readFileSync("cert.pem"),
		// 	},
		// 	host: env.VITE_HOST || "localhost",
		// 	port: env.VITE_PORT || 5173,
		// },

		server: {
			host: env.VITE_HOST || "localhost",
			port: env.VITE_PORT || 5173,
			https: false, // Disable HTTPS
		},
	};
});
