import type { SetEventKey } from "../shared/event";

type Replace<
	S extends string,
	Pattern extends string,
	Replacement extends string,
> = S extends `${infer Prefix}${Pattern}${infer Suffix}` ? `${Prefix}${Replacement}${Suffix}` : S;

type StorageKey = Replace<SetEventKey, "SET_GITHUB_", "GITHUB_">;

async function getAsync(key: StorageKey): Promise<string> {
	try {
		const value = await figma.clientStorage.getAsync(key);
		return value;
	} catch (err) {
		throw new Error("Error getting value from client storgage");
	}
}

async function setAsync(key: StorageKey, value: unknown): Promise<void> {
	try {
		const storagedValue = typeof value === "string" ? value : JSON.stringify(value);
		await figma.clientStorage.setAsync(key, storagedValue);
	} catch (err) {
		throw new Error("Error setting value to client storage");
	}
}

async function deleteAsync(key: StorageKey): Promise<void> {
	try {
		await figma.clientStorage.deleteAsync(key);
	} catch (err) {
		throw new Error("Error deleting value from client storage");
	}
}

export const clientStorage = { getAsync, setAsync, deleteAsync } as const;
