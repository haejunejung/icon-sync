import { useContext } from "react";
import { FigmaContext } from "../contexts";

export const useFigma = () => {
	const context = useContext(FigmaContext);
	if (context === undefined) {
		throw new Error("useFigma must be used within an FigmaProvider");
	}
	return context;
};
