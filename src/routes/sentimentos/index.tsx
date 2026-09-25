import { PlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { TableAvaliation } from "./-components/table-avaliation";

export const Route = createFileRoute("/sentimentos/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col gap-8 p-4 max-w-270 w-full mx-auto">
			<header className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Heading as="h1" variant="h3">
						Avaliação de Sentimentos
					</Heading>
					<Link
						to="/sentimentos/criar"
						className={buttonVariants({ variant: "default", size: "lg" })}
					>
						<HugeiconsIcon icon={PlusIcon} strokeWidth={2} />
						Adicionar Nova Avaliação
					</Link>
				</div>
				<p>
					Registre seu estado emocional e acompanhe sua evolução ao longo do tempo
				</p>
			</header>

			<TableAvaliation />
		</main>
	);
}
