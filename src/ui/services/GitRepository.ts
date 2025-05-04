import type { GitService } from "./GitService";

export class GitRepository {
	constructor(private readonly git: GitService) {}

	async ensureBranchExists({
		mainBranch,
		compareBranch,
	}: { mainBranch: string; compareBranch: string }) {
		const main = await this.git.getBranch(mainBranch);
		const compare = await this.git.getBranch(compareBranch);

		if (!main) {
			throw new Error("Base branch does not exist");
		}

		if (!compare) {
			await this.git.createRef(compareBranch, main.commit.sha);
		}

		return undefined;
	}

	async commit({
		compareBranch,
		blobs,
		commitMessage = "feat(icons): Update icons from figma",
		storePath,
	}: {
		compareBranch: string;
		blobs: { path: string; content: string }[];
		commitMessage: string;
		storePath: string;
	}) {
		const baseRef = await this.git.getRef(compareBranch);
		if (!baseRef) {
			throw new Error("Base ref does not exist");
		}

		const baseCommit = await this.git.getCommit(baseRef.object.sha);
		const baseCommitSha = baseCommit?.sha;
		if (!baseCommitSha) {
			throw new Error("Base commit does not exist");
		}

		const baseTreeSha = baseCommit?.tree.sha;
		if (!baseTreeSha) {
			throw new Error("Base tree does not exist");
		}
		const treeEntries = await this.buildTreeEntries({
			branch: compareBranch,
			blobs,
			storePath,
		});

		const newTree = await this.git.createTree(baseCommitSha, treeEntries);
		const newCommit = await this.git.createCommit({
			message: commitMessage,
			parents: [baseCommitSha],
			tree: newTree.sha,
		});

		await this.git.updateRef(compareBranch, newCommit.sha, true);
		return newCommit;
	}

	async pullRequest({
		mainBranch,
		compareBranch,
		title = "feat(icons): Update icons from figma",
		body,
		state = "open",
	}: {
		mainBranch: string;
		compareBranch: string;
		title: string;
		body: string;
		state: "open" | "closed" | "all";
	}) {
		const currentPRs = await this.git.getPullRequests({
			head: compareBranch,
			base: mainBranch,
			state,
		});
		const latestPR = currentPRs?.find((pr) => pr.head.ref === compareBranch);

		if (latestPR) {
			const newPR = await this.git.updatePullRequest(latestPR.number, body);
			return newPR;
		}

		return this.git.createPullRequest({
			title,
			body,
			head: compareBranch,
			base: mainBranch,
		});
	}

	private async getDiff({
		branch,
		blobs,
		storePath,
	}: {
		branch: string;
		blobs: { path: string; content: string }[];
		storePath: string;
	}): Promise<string[]> {
		const ref = await this.git.getRef(branch);
		if (!ref) return [];

		const commit = await this.git.getCommit(ref.object.sha);
		if (!commit) return [];

		const tree = await this.git.getTree(commit.tree.sha, "true");
		if (!tree) return [];

		const previousPaths = new Set(
			tree.tree
				.map((b) => b.path)
				.filter(
					(path): path is string => typeof path === "string" && path.startsWith(`${storePath}/`),
				),
		);

		const currentPaths = new Set(
			blobs.map((b) => b.path).filter((path) => path.startsWith(`${storePath}/`)),
		);

		return [...previousPaths].filter((path) => !currentPaths.has(path));
	}

	private async buildTreeEntries({
		branch,
		blobs,
		storePath,
	}: {
		branch: string;
		blobs: { path: string; content: string }[];
		storePath: string;
	}): Promise<{ path: string; mode: "100644"; type: "blob"; sha: string | null }[]> {
		const diff = await this.getDiff({ branch, blobs, storePath });
		const deletedBlobs = diff.map((path) => ({ path }));
		const deletedPaths = new Set(deletedBlobs.map((b) => b.path));

		const created = await Promise.all(
			blobs
				.filter(({ path }) => !deletedPaths.has(path))
				.map(async ({ path, content }) => {
					const blob = await this.git.createBlob(content);
					return {
						path,
						mode: "100644",
						type: "blob",
						sha: blob.sha,
					} as const;
				}),
		);

		const deletions = [...deletedPaths].map(
			(path) =>
				({
					path,
					mode: "100644",
					type: "blob",
					sha: null,
				}) as const,
		);

		return [...created, ...deletions];
	}
}
