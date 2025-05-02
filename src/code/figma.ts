import type { Icon } from "../shared/types";

function isComponent(node: SceneNode): node is ComponentNode {
	return node.type === "COMPONENT";
}

export function notify(message: string) {
	figma.notify(message);
}

export function getSelection(): readonly SceneNode[] {
	const selection = figma.currentPage.selection;
	return selection;
}

export function isSelected(): boolean {
	const selection = figma.currentPage.selection;
	return selection.length > 0;
}

export function findAllComponentsInCurrentPage(): ComponentNode[] {
	const currentPage = figma.currentPage;
	const components = currentPage
		.findAll((node) => node.type === "COMPONENT")
		.filter(isComponent)
		.flat();

	return components;
}

export function findAllComponentsInSelectedFrames(): ComponentNode[] {
	const selection = figma.currentPage.selection;
	const frame = selection.find((node) => node.type === "FRAME");

	if (!frame) return [];

	const components = frame
		.findAll((node) => node.type === "COMPONENT")
		.filter(isComponent)
		.flat();

	return components;
}

export async function extractIcon(component: ComponentNode): Promise<Icon> {
	const svgData = await component.exportAsync({ format: "SVG_STRING" });
	return {
		id: component.id,
		name: component.name,
		data: svgData,
	};
}
