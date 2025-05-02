import { useContext } from "react";
import { GitContext } from "../contexts";

export const useGit = () => {
	const context = useContext(GitContext);
	if (context === undefined) {
		throw new Error("useGit must be used within an GitProvider");
	}
	return context;
};
