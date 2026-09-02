import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "@/components/others/typography";
import { FormEmotion } from "./-components/form";

export const Route = createFileRoute("/feelings/novo/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<Heading as="h1" variant="h1">
					{new Date().toLocaleDateString("pt-BR", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					})}
				</Heading>

				<p>
					Preencha os campos abaixo para registrar uma nova avaliação de
					sentimento.
				</p>
			</header>
			<FormEmotion />
		</main>
	);
}
