import { createFileRoute, Link } from "@tanstack/react-router";
import { Heading } from "@/components/-/typography";
import { TableAvaliation } from "./-components/table-avaliation";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusIcon } from "@hugeicons/core-free-icons";

export const Route = createFileRoute("/sentimentos/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Heading as="h1" variant="h1">
						Avaliação de Sentimentos
					</Heading>
					<Link to="/sentimentos/criar" className={buttonVariants({ variant: "default", size: "lg" })}>
						<HugeiconsIcon icon={PlusIcon} strokeWidth={2} />
						Adicionar Nova Avaliação
					</Link>
				</div>
				<p>
					Aqui você pode editar, deletar e acompanhar seus sentimentos ao longo
					do tempo.
				</p>
			</header>

			<TableAvaliation />
		</main>
	);
}
