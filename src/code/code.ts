import { emit, on } from "../shared/event";
import {
	extractIcon,
	findAllComponentsInCurrentPage,
	findAllComponentsInSelectedFrames,
	isSelected,
	notify,
} from "./figma";
import { clientStorage } from "./storage";

(async function main() {
	figma.showUI(__html__, { width: 600, height: 600 });

	on("GET_ICONS", async () => {
		const findFunc = isSelected()
			? findAllComponentsInSelectedFrames
			: findAllComponentsInCurrentPage;

		const components = findFunc();
		if (components.length === 0) {
			notify("No components found.");
			return;
		}

		const icons = await Promise.all(components.map(extractIcon));
		emit("GET_ICONS", { icons });
	});

	on("GET_GITHUB_AUTH", async () => {
		const [owner, apiKey, repo, mainBranch, compareBranch, storePath] = await Promise.all([
			clientStorage.getAsync("GITHUB_OWNER"),
			clientStorage.getAsync("GITHUB_API_KEY"),
			clientStorage.getAsync("GITHUB_REPO"),
			clientStorage.getAsync("GITHUB_MAIN_BRANCH"),
			clientStorage.getAsync("GITHUB_COMPARE_BRANCH"),
			clientStorage.getAsync("GITHUB_STORE_PATH"),
		]);

		const payload = {
			owner,
			apiKey,
			mainBranch,
			compareBranch,
			repo,
			storePath,
		};
		emit("GET_GITHUB_AUTH", payload);
	});

	on("SET_GITHUB_OWNER", async ({ owner }) => {
		await clientStorage.setAsync("GITHUB_OWNER", owner);
	});

	on("SET_GITHUB_API_KEY", async ({ apiKey }) => {
		await clientStorage.setAsync("GITHUB_API_KEY", apiKey);
	});

	on("SET_GITHUB_REPO", async ({ repo }) => {
		await clientStorage.setAsync("GITHUB_REPO", repo);
	});

	on("SET_GITHUB_MAIN_BRANCH", async ({ mainBranch }) => {
		await clientStorage.setAsync("GITHUB_MAIN_BRANCH", mainBranch);
	});

	on("SET_GITHUB_COMPARE_BRANCH", async ({ compareBranch }) => {
		await clientStorage.setAsync("GITHUB_COMPARE_BRANCH", compareBranch);
	});

	on("SET_GITHUB_STORE_PATH", async ({ storePath }) => {
		await clientStorage.setAsync("GITHUB_STORE_PATH", storePath);
	});

	on("NOTIFY", ({ message }) => {
		notify(message);
	});

	on("CLOSE_PLUGIN", () => {
		figma.closePlugin();
	});
})();
