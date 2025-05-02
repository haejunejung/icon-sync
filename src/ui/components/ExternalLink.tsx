import type { PropsWithChildren } from "react";

export function ExternalLink({
	href,
	children,
}: PropsWithChildren<{ href: string | (() => string) }>) {
	const resolvedHref = typeof href === "function" ? href() : href;

	return (
		<a href={resolvedHref} target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	);
}
