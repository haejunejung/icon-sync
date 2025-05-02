import { useMemo } from "react";
import { emit } from "../../shared/event";
import type { Icon } from "../../shared/types";
import { Button, Card, CardFooter, ExternalLink, LoadingSpinner, SwitchCase } from "../components";
import { useAsyncTasks, useFigma, useGit } from "../hooks";

export function IconSyncPage() {
	const { state } = useFigma();
	const { gitRepository } = useGit();

	const blobs = useMemo(() => {
		return state.icons.map((icon) => ({
			path: `${state.storePath}/${icon.name}.svg`,
			content: icon.data,
		}));
	}, [state.icons, state.storePath]);

	const tasks = useMemo(() => {
		return [
			{
				label: "Preparing branch...",
				task: () =>
					gitRepository.ensureBranchExists({
						mainBranch: state.mainBranch,
						compareBranch: state.compareBranch,
					}),
			},
			{
				label: "Creating commit...",
				task: () =>
					gitRepository.commit({
						compareBranch: state.compareBranch,
						blobs,
						commitMessage: "feat(icons): Update icons from figma",
					}),
			},
			{
				label: "Creating pull request...",
				task: () =>
					gitRepository.pullRequest({
						mainBranch: state.mainBranch,
						compareBranch: state.compareBranch,
						title: "feat(icons): Update icons from figma",
						body: "Update icons from figma",
						state: "open",
					}),
			},
		];
	}, [gitRepository, state.compareBranch, state.mainBranch, blobs]);

	const { status, currentStep, lastResult, reset, run } = useAsyncTasks(tasks);

	return (
		<div className="flex flex-col relative w-full h-full">
			<SwitchCase
				value={status}
				caseBy={{
					idle: (
						<Card className="p-4 gap-4 w-full h-full justify-between">
							<IconList icons={state.icons} />
							<CardFooter className="flex justify-between gap-4">
								<Button
									type="button"
									variant="outline"
									className="flex-1"
									onClick={() => emit("GET_ICONS")}
								>
									Import Icons
								</Button>
								<Button
									type="button"
									variant="default"
									className="flex-1"
									disabled={state.icons.length === 0}
									onClick={() => {
										reset();
										run();
									}}
								>
									Deploy
								</Button>
							</CardFooter>
						</Card>
					),
					running: (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4">
							<div className="mb-2 text-sm text-gray-500">{currentStep?.label}</div>
							<LoadingSpinner />
						</div>
					),
					error: (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4">
							<div className="mb-2 text-sm text-red-500">Error Occured</div>
							<Button type="button" variant="destructive" onClick={reset}>
								Go Back
							</Button>
						</div>
					),
					done: (
						<div className="absolute inset-0 flex flex-row items-center justify-center text-center gap-4">
							<Button type="button" variant="outline" onClick={reset}>
								Go Back
							</Button>
							{lastResult && (
								<ExternalLink href={lastResult.html_url}>
									<Button type="button" variant="default" onClick={reset}>
										Go Github
									</Button>
								</ExternalLink>
							)}
						</div>
					),
				}}
			/>
		</div>
	);
}

function IconList({ icons }: { icons: Icon[] }) {
	return (
		<div className="grid grid-cols-4 gap-4">
			{icons.map((icon) => (
				<Card key={icon.id} className="flex flex-col items-center">
					<img src={`data:image/svg+xml;base64,${btoa(icon.data)}`} alt={icon.name} />
				</Card>
			))}
		</div>
	);
}
