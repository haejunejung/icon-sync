import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";
import type { WithNil } from "../../shared/types";

const NOT_FOUND = 404;

const isOctokitError = (error: unknown): error is { status: number } => {
	return typeof error === "object" && error !== null && "status" in error;
};

export class GitService {
	private octokit: Octokit;

	constructor(
		private owner: string,
		private repo: string,
		apiKey: string,
	) {
		this.octokit = new Octokit({ auth: apiKey });
	}

	// ---------------- Queries ---------------- //

	async getBranch(
		branch: RestEndpointMethodTypes["repos"]["getBranch"]["parameters"]["branch"],
	): Promise<WithNil<RestEndpointMethodTypes["repos"]["getBranch"]["response"]["data"]>> {
		try {
			const { data } = await this.octokit.rest.repos.getBranch({
				owner: this.owner,
				repo: this.repo,
				branch,
			});
			return data;
		} catch (err) {
			if (isOctokitError(err) && err.status === NOT_FOUND) return null;
			throw new Error("Failed to get branch");
		}
	}

	async getRef(
		ref: RestEndpointMethodTypes["git"]["getRef"]["parameters"]["ref"],
	): Promise<WithNil<RestEndpointMethodTypes["git"]["getRef"]["response"]["data"]>> {
		try {
			const { data } = await this.octokit.rest.git.getRef({
				owner: this.owner,
				repo: this.repo,
				ref: `heads/${ref}`,
			});
			return data;
		} catch (err) {
			if (isOctokitError(err) && err.status === NOT_FOUND) return null;
			throw new Error("Failed to get ref");
		}
	}

	async getCommit(
		commit_sha: RestEndpointMethodTypes["git"]["getCommit"]["parameters"]["commit_sha"],
	): Promise<WithNil<RestEndpointMethodTypes["git"]["getCommit"]["response"]["data"]>> {
		try {
			const { data } = await this.octokit.rest.git.getCommit({
				owner: this.owner,
				repo: this.repo,
				commit_sha,
			});
			return data;
		} catch (err) {
			if (isOctokitError(err) && err.status === NOT_FOUND) return null;
			throw new Error("Failed to get commit");
		}
	}

	async getTree(
		tree_sha: RestEndpointMethodTypes["git"]["getTree"]["parameters"]["tree_sha"],
		recursive?: RestEndpointMethodTypes["git"]["getTree"]["parameters"]["recursive"],
	): Promise<WithNil<RestEndpointMethodTypes["git"]["getTree"]["response"]["data"]>> {
		try {
			const { data } = await this.octokit.rest.git.getTree({
				owner: this.owner,
				repo: this.repo,
				tree_sha,
				recursive,
			});
			return data;
		} catch (err) {
			if (isOctokitError(err) && err.status === NOT_FOUND) return null;
			throw new Error("Failed to get tree");
		}
	}

	async getPullRequests(params: {
		head: string;
		base: string;
		state?: RestEndpointMethodTypes["pulls"]["list"]["parameters"]["state"];
	}): Promise<WithNil<RestEndpointMethodTypes["pulls"]["list"]["response"]["data"]>> {
		try {
			const { data } = await this.octokit.rest.pulls.list({
				owner: this.owner,
				repo: this.repo,
				head: `${this.owner}:${params.head}`,
				base: params.base,
				state: params.state,
			});
			return data;
		} catch (err) {
			if (isOctokitError(err) && err.status === NOT_FOUND) return null;
			throw new Error("Failed to get pull requests");
		}
	}

	// ---------------- Mutations ---------------- //

	async createRef(
		ref: RestEndpointMethodTypes["git"]["createRef"]["parameters"]["ref"],
		sha: RestEndpointMethodTypes["git"]["createRef"]["parameters"]["sha"],
	): Promise<RestEndpointMethodTypes["git"]["createRef"]["response"]["data"]> {
		const { data } = await this.octokit.rest.git.createRef({
			owner: this.owner,
			repo: this.repo,
			ref: `refs/heads/${ref}`,
			sha,
		});
		return data;
	}

	async createBlob(
		content: RestEndpointMethodTypes["git"]["createBlob"]["parameters"]["content"],
	): Promise<RestEndpointMethodTypes["git"]["createBlob"]["response"]["data"]> {
		const { data } = await this.octokit.rest.git.createBlob({
			owner: this.owner,
			repo: this.repo,
			content,
			encoding: "utf-8",
		});
		return data;
	}

	async createTree(
		base_tree: RestEndpointMethodTypes["git"]["createTree"]["parameters"]["base_tree"],
		tree: RestEndpointMethodTypes["git"]["createTree"]["parameters"]["tree"],
	): Promise<RestEndpointMethodTypes["git"]["createTree"]["response"]["data"]> {
		const { data } = await this.octokit.rest.git.createTree({
			owner: this.owner,
			repo: this.repo,
			base_tree,
			tree,
		});
		return data;
	}

	async createCommit(params: {
		message: string;
		parents: string[];
		tree: string;
		author?: RestEndpointMethodTypes["git"]["createCommit"]["parameters"]["author"];
	}): Promise<RestEndpointMethodTypes["git"]["createCommit"]["response"]["data"]> {
		const { data } = await this.octokit.rest.git.createCommit({
			owner: this.owner,
			repo: this.repo,
			message: params.message,
			parents: params.parents,
			tree: params.tree,
			author: params.author,
		});
		return data;
	}

	async createPullRequest(params: {
		title: string;
		body: string;
		head: string;
		base: string;
	}): Promise<RestEndpointMethodTypes["pulls"]["create"]["response"]["data"]> {
		const { data } = await this.octokit.rest.pulls.create({
			owner: this.owner,
			repo: this.repo,
			title: params.title,
			body: params.body,
			head: params.head,
			base: params.base,
		});
		return data;
	}

	async updateRef(
		ref: string,
		sha: string,
		force?: boolean,
	): Promise<RestEndpointMethodTypes["git"]["updateRef"]["response"]["data"]> {
		const { data } = await this.octokit.rest.git.updateRef({
			owner: this.owner,
			repo: this.repo,
			ref: `heads/${ref}`,
			sha,
			force,
		});
		return data;
	}

	async updatePullRequest(
		pull_number: number,
		body: string,
	): Promise<RestEndpointMethodTypes["pulls"]["update"]["response"]["data"]> {
		const { data } = await this.octokit.rest.pulls.update({
			owner: this.owner,
			repo: this.repo,
			pull_number,
			body,
		});
		return data;
	}
}
