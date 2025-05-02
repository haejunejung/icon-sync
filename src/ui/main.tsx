import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

document.addEventListener("DOMContentLoaded", () => {
	// biome-ignore lint/style/noNonNullAssertion: ignore
	createRoot(document.getElementById("root")!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
});
