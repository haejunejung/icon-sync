export interface Icon {
	id: string;
	name: string;
	data: string;
}

export interface GithubAuthPayload {
	owner: string;
	apiKey: string;
	mainBranch: string;
	compareBranch: string;
	repo: string;
	storePath: string;
}

export type WithNil<T> = T | null | undefined;

export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type UnionToIntersection<U> = (U extends U ? (x: U) => void : never) extends (
	x: infer I,
) => void
	? I
	: never;
