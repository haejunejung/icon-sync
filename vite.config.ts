import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	build: {
		target: "esnext",
		assetsInlineLimit: 100000000,
		cssCodeSplit: false,
	},
	plugins: [react(), tailwindcss(), viteSingleFile()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
