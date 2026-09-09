// src/routes/__root.tsx

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<nav className="flex gap-8 p-4 border-b items-center">
				<Link to="/" className="[&.active]:font-bold">
					Início
				</Link>
				<div className="flex gap-2 items-center">
					<Link to="/sentimentos" className="[&.active]:font-bold">
						Avaliação de sentimentos
					</Link>
				</div>
			</nav>
			<main className="p-4">
				<Outlet />
			</main>
		</>
	),
});
