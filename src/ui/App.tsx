import type { ReactNode } from "react";
import { Link, MemoryRouter, Outlet, Route, Routes } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "./components";
import { FigmaProvider, GitProvider } from "./contexts";
import { GithubAuthPage, IconSyncPage } from "./pages";
import "./global.css";

function Providers({ children }: { children: ReactNode }) {
	return (
		<FigmaProvider>
			<GitProvider>{children}</GitProvider>
		</FigmaProvider>
	);
}

function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen w-screen flex-col p-4 gap-4">
			<Tabs defaultValue="/">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger asChild value="/github-auth">
						<Link to="/github-auth">Github</Link>
					</TabsTrigger>
					<TabsTrigger asChild value="/">
						<Link to="/">Deploy</Link>
					</TabsTrigger>
				</TabsList>
			</Tabs>
			{children}
		</div>
	);
}

export function App() {
	return (
		<Providers>
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route
						element={
							<Layout>
								<Outlet />
							</Layout>
						}
					>
						<Route path="/" element={<IconSyncPage />} />
						<Route path="/github-auth" element={<GithubAuthPage />} />
					</Route>
				</Routes>
			</MemoryRouter>
		</Providers>
	);
}
