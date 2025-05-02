import { useCallback, useRef, useState } from "react";

export type AsyncTask<T = unknown> = {
	label?: string;
	task: () => Promise<T>;
};

export type QueueStatus = "idle" | "running" | "done" | "error";

export function useAsyncTasks<Steps extends readonly AsyncTask<unknown>[]>(steps: Steps) {
	const [status, setStatus] = useState<QueueStatus>("idle");
	const [error, setError] = useState<Error | null>(null);
	const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

	type Results = {
		[K in keyof Steps]: Steps[K] extends AsyncTask<infer R> ? R : never;
	};

	const resultsRef = useRef<Results>([] as unknown as Results);

	const reset = useCallback(() => {
		resultsRef.current = [] as unknown as Results;
		setStatus("idle");
		setError(null);
		setCurrentStepIndex(-1);
	}, []);

	const run = useCallback(async (): Promise<Results> => {
		if (steps.length === 0) return [] as unknown as Results;

		setStatus("running");
		setError(null);
		resultsRef.current = [] as unknown as Results;

		for (let i = 0; i < steps.length; i++) {
			setCurrentStepIndex(i);
			try {
				const result = await steps[i].task();
				// biome-ignore lint/suspicious/noExplicitAny: allow
				(resultsRef.current as any[]).push(result);
			} catch (err) {
				setStatus("error");
				setError(err instanceof Error ? err : new Error("Unknown error"));
				throw err;
			}
		}

		setStatus("done");
		setCurrentStepIndex(-1);
		return resultsRef.current;
	}, [steps]);

	const currentStep =
		currentStepIndex >= 0 && currentStepIndex < steps.length
			? {
					...steps[currentStepIndex],
					// biome-ignore lint/suspicious/noExplicitAny: allow
					result: (resultsRef.current as any)[currentStepIndex],
					index: currentStepIndex,
				}
			: null;

	return {
		status,
		error,
		currentStepIndex,
		reset,
		run,
		currentStep,
		results: resultsRef.current,
		// biome-ignore lint/suspicious/noExplicitAny: allow
		lastResult: (resultsRef.current as any)[steps.length - 1] as Results[number],
	} as const;
}
