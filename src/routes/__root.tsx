// src/routes/__root.tsx

import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

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
					<Link
						to="/sentimentos/create"
						className={` ${buttonVariants({ variant: "default", size: "xs" })} [&.active]:bg-emerald-500`}
					>
						Novo
						<HugeiconsIcon icon={Plus} strokeWidth={2} className="size-4" />
					</Link>
				</div>
			</nav>
			<main className="p-4">
				<Outlet />
			</main>
		</>
	),
});
