import { emit as _emit, on as _on, once as _once } from "@create-figma-plugin/utilities";
import type { GithubAuthPayload, Icon } from "./types";

export const GET_EVENT_KEYS = {
	GET_ICONS: "GET_ICONS",
	GET_GITHUB_AUTH: "GET_GITHUB_AUTH",
} as const;

export const SET_EVENT_KEYS = {
	SET_GITHUB_OWNER: "SET_GITHUB_OWNER",
	SET_GITHUB_API_KEY: "SET_GITHUB_API_KEY",
	SET_GITHUB_MAIN_BRANCH: "SET_GITHUB_MAIN_BRANCH",
	SET_GITHUB_COMPARE_BRANCH: "SET_GITHUB_COMPARE_BRANCH",
	SET_GITHUB_REPO: "SET_GITHUB_REPO",
	SET_GITHUB_STORE_PATH: "SET_GITHUB_STORE_PATH",
} as const;

export const COMMON_KEYS = {
	NOTIFY: "NOTIFY",
	CLOSE_PLUGIN: "CLOSE_PLUGIN",
} as const;

export const EVENT_KEYS = {
	...GET_EVENT_KEYS,
	...SET_EVENT_KEYS,
	...COMMON_KEYS,
} as const;

export type GetEventKey = (typeof GET_EVENT_KEYS)[keyof typeof GET_EVENT_KEYS];

export type SetEventKey = (typeof SET_EVENT_KEYS)[keyof typeof SET_EVENT_KEYS];

export type CommonKey = (typeof COMMON_KEYS)[keyof typeof COMMON_KEYS];

export type EventKey = (typeof EVENT_KEYS)[keyof typeof EVENT_KEYS];

export type EventPayload = {
	[EVENT_KEYS.GET_ICONS]: { icons: Icon[] };
	[EVENT_KEYS.GET_GITHUB_AUTH]: {
		[P in keyof GithubAuthPayload]: GithubAuthPayload[P];
	};
	[EVENT_KEYS.SET_GITHUB_OWNER]: { owner: GithubAuthPayload["owner"] };
	[EVENT_KEYS.SET_GITHUB_API_KEY]: { apiKey: GithubAuthPayload["apiKey"] };
	[EVENT_KEYS.SET_GITHUB_MAIN_BRANCH]: {
		mainBranch: GithubAuthPayload["mainBranch"];
	};
	[EVENT_KEYS.SET_GITHUB_COMPARE_BRANCH]: {
		compareBranch: GithubAuthPayload["compareBranch"];
	};
	[EVENT_KEYS.SET_GITHUB_REPO]: {
		repo: GithubAuthPayload["repo"];
	};
	[EVENT_KEYS.SET_GITHUB_STORE_PATH]: {
		storePath: GithubAuthPayload["storePath"];
	};
	[EVENT_KEYS.NOTIFY]: {
		message: string;
	};
	[EVENT_KEYS.CLOSE_PLUGIN]: never;
};

export type EventMap = {
	[K in keyof EventPayload]: {
		payload: EventPayload[K];
	};
};

export type Event<K extends EventKey> = {
	key: K;
	payload: EventMap[K]["payload"];
	handler: (payload: EventMap[K]["payload"]) => void | Promise<void>;
};

/**
 * Calling `emit` in the main context invokes the event handler for the matching event name in UI.
 * @link https://yuanqing.github.io/create-figma-plugin/utilities/#emit
 */
export function emit<K extends EventKey>(key: K, payload?: EventMap[K]["payload"]) {
	return _emit(key, payload);
}

/**
 * Registers an event handler for the given event name.
 * @link https://yuanqing.github.io/create-figma-plugin/utilities/#on
 */
export function on<K extends EventKey>(key: K, handler: Event<K>["handler"]) {
	return _on(key, handler);
}

/**
 * Ditto `on`, only that handler will run at most `once`.
 * @link https://yuanqing.github.io/create-figma-plugin/utilities/#on
 */
export function once<K extends EventKey>(key: K, handler: Event<K>["handler"]): () => void {
	return _once(key, handler);
}
