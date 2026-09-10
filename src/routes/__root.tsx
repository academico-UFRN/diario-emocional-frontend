// src/routes/__root.tsx

import { ModeToggle } from "@/components/-/mode-toggle";
import { Toaster } from "@/components/ui/toast";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex gap-8 justify-between p-4 border-b items-center">
				<nav className="flex gap-2 item-center">
					<Link to="/" className="[&.active]:font-medium rounded-full px-2 py-1">
						Início
					</Link>
					<Link to="/sentimentos" className="[&.active]:font-medium rounded-full px-2 py-1">
						Avaliação de sentimentos
					</Link>
					<Link to="/relatoDia" className="[&.active]:font-medium rounded-full px-2 py-1">
						Relato do dia
					</Link>
				</nav>

				<div className="flex gap-2 items-center">

				</div>

				<ModeToggle />
			</div>
			<main className="p-4">
				<Outlet />
			</main>
			<Toaster />
		</>
	),
});
