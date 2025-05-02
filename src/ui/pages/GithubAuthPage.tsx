import { Input, Label } from "../components";
import { useFigma } from "../hooks";

export function GithubAuthPage() {
	const { state, dispatch } = useFigma();

	const { owner, apiKey, mainBranch, compareBranch, repo, storePath } = state;

	return (
		<div className="flex flex-col gap-4">
			<FormField
				label="Owner"
				value={owner}
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_OWNER",
						payload: { owner: e.target.value },
					});
				}}
			/>

			<FormField
				label="API Key"
				value={apiKey}
				inputType="password"
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_API_KEY",
						payload: { apiKey: e.target.value },
					});
				}}
			/>

			<FormField
				label="Main Branch Name"
				value={mainBranch}
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_MAIN_BRANCH",
						payload: { mainBranch: e.target.value },
					});
				}}
			/>

			<FormField
				label="Compare Branch Name"
				value={compareBranch}
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_COMPARE_BRANCH",
						payload: { compareBranch: e.target.value },
					});
				}}
			/>

			<FormField
				label="Repo Name"
				value={repo}
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_REPO",
						payload: { repo: e.target.value },
					});
				}}
			/>

			<FormField
				label="Store Path"
				value={storePath}
				onChange={(e) => {
					dispatch({
						key: "SET_GITHUB_STORE_PATH",
						payload: { storePath: e.target.value },
					});
				}}
			/>
		</div>
	);
}

function FormField({
	label,
	value,
	onChange,
	inputType = "text",
}: {
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	inputType?: "text" | "password";
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label>{label}</Label>
			<Input type={inputType} value={value} onChange={onChange} />
		</div>
	);
}
