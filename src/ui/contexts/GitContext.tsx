import { type ReactNode, createContext, useMemo } from "react";
import { useFigma } from "../hooks";
import { GitRepository, GitService } from "../services";

type GitContextValue = {
	gitService: GitService;
	gitRepository: GitRepository;
};

export const GitContext = createContext<GitContextValue | undefined>(undefined);

export function GitProvider({ children }: { children: ReactNode }) {
	const { state } = useFigma();
	const { owner, apiKey, repo } = state;

	const gitService = useMemo(() => new GitService(owner, repo, apiKey), [owner, repo, apiKey]);
	const gitRepository = useMemo(() => new GitRepository(gitService), [gitService]);

	return (
		<GitContext.Provider value={{ gitService, gitRepository }}>{children}</GitContext.Provider>
	);
}
