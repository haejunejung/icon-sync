import type { ReactNode } from "react";

interface SwitchCaseProps<Case extends PropertyKey> {
	value: Case | null | undefined;
	caseBy: Record<Case, React.ReactNode>;
	defaultComponent?: React.ReactNode;
}

export const SwitchCase = <Case extends PropertyKey>({
	caseBy,
	value,
	defaultComponent = null,
}: SwitchCaseProps<Case>): ReactNode => {
	if (value == null) {
		return <>{defaultComponent}</>;
	}

	return <>{caseBy[value] ?? defaultComponent}</>;
};
