import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "@/components/others/typography";
import { TableAvaliation } from "./-components/table-avaliation";

export const Route = createFileRoute("/sentimentos/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<Heading as="h1" variant="h1">
					Avaliação de Sentimentos
				</Heading>
				<p>
					Aqui você pode editar, deletar e acompanhar seus sentimentos ao longo
					do tempo.
				</p>
			</header>

			<TableAvaliation />
		</main>
	);
}
