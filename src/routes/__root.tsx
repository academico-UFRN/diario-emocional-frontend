// src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<nav className="flex gap-4 p-4 border-b">
				<Link to="/" className="[&.active]:font-bold">
					Início
				</Link>
				<Link to="/feelings" className="[&.active]:font-bold">
					Sentimentos
				</Link>
				<Link to="/feelings/novo" className="[&.active]:font-bold">
					Novo Sentimento
				</Link>
			</nav>
			<main className="p-4">
				<Outlet />
			</main>
		</>
	),
});
