import { type Dispatch, type ReactNode, createContext, useEffect, useReducer } from "react";
import { type Event, type EventKey, emit, on, once } from "../../shared/event";
import type { Simplify, UnionToIntersection } from "../../shared/types";

type FigmaContextState = Simplify<
	UnionToIntersection<{ [K in EventKey]: Pick<Event<K>, "payload"> }[EventKey]["payload"]>
>;

type FigmaContextDispatch = Simplify<{ [K in EventKey]: Omit<Event<K>, "handler"> }[EventKey]>;

type FigmaContextValue = {
	state: FigmaContextState;
	dispatch: Dispatch<FigmaContextDispatch>;
};

const initialState: FigmaContextState = {
	owner: "",
	apiKey: "",
	mainBranch: "main",
	compareBranch: "icon-sync",
	repo: "",
	storePath: "",
	message: "",
	icons: [],
};

export const FigmaContext = createContext<FigmaContextValue | undefined>(undefined);

const reducer = (state: FigmaContextState, action: FigmaContextDispatch): FigmaContextState => {
	switch (action.key) {
		//* Setters
		case "SET_GITHUB_OWNER": {
			emit("SET_GITHUB_OWNER", {
				owner: action.payload.owner,
			});

			return {
				...state,
				owner: action.payload.owner,
			};
		}

		case "SET_GITHUB_API_KEY": {
			emit("SET_GITHUB_API_KEY", {
				apiKey: action.payload.apiKey,
			});

			return {
				...state,
				apiKey: action.payload.apiKey,
			};
		}

		case "SET_GITHUB_MAIN_BRANCH": {
			emit("SET_GITHUB_MAIN_BRANCH", {
				mainBranch: action.payload.mainBranch,
			});

			return {
				...state,
				mainBranch: action.payload.mainBranch,
			};
		}

		case "SET_GITHUB_COMPARE_BRANCH": {
			emit("SET_GITHUB_COMPARE_BRANCH", {
				compareBranch: action.payload.compareBranch,
			});

			return {
				...state,
				compareBranch: action.payload.compareBranch,
			};
		}

		case "SET_GITHUB_REPO": {
			emit("SET_GITHUB_REPO", {
				repo: action.payload.repo,
			});

			return {
				...state,
				repo: action.payload.repo,
			};
		}

		case "SET_GITHUB_STORE_PATH": {
			emit("SET_GITHUB_STORE_PATH", {
				storePath: action.payload.storePath,
			});

			return {
				...state,
				storePath: action.payload.storePath,
			};
		}

		//* Getters
		case "GET_GITHUB_AUTH": {
			return {
				...state,
				owner: action.payload.owner,
				apiKey: action.payload.apiKey,
				mainBranch: action.payload.mainBranch,
				compareBranch: action.payload.compareBranch,
				repo: action.payload.repo,
				storePath: action.payload.storePath,
			};
		}

		case "GET_ICONS": {
			return {
				...state,
				icons: action.payload.icons,
			};
		}

		//* Commons
		case "NOTIFY": {
			emit("NOTIFY", {
				message: action.payload.message,
			});

			return state;
		}

		case "CLOSE_PLUGIN": {
			emit("CLOSE_PLUGIN");
			return state;
		}

		default: {
			throw new Error("정의되지 않은 키입니다.");
		}
	}
};

export const FigmaProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	on("GET_ICONS", ({ icons }) => {
		dispatch({ key: "GET_ICONS", payload: { icons } });
	});

	once("GET_GITHUB_AUTH", ({ owner, apiKey, mainBranch, compareBranch, repo, storePath }) => {
		dispatch({
			key: "GET_GITHUB_AUTH",
			payload: {
				owner,
				apiKey,
				mainBranch,
				compareBranch,
				repo,
				storePath,
			},
		});
	});

	useEffect(() => {
		emit("GET_ICONS");
		emit("GET_GITHUB_AUTH");
	}, []);

	return <FigmaContext.Provider value={{ state, dispatch }}>{children}</FigmaContext.Provider>;
};
