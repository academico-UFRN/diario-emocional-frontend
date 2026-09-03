import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CriarAvaliacaoSentimento } from "@/api/avaliacao-sentimento/avalicao-sentimento.service";
import type { AvaliacaoSentimentoCriar } from "@/api/avaliacao-sentimento/schema";
import { Heading } from "@/components/others/typography";
import { FormEmotion, type FormEmotionValues } from "./-components/form";

export const Route = createFileRoute("/sentimentos/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate, isPending } = useMutation({
		mutationFn: CriarAvaliacaoSentimento,
		onSuccess: (data) => {
			console.log("Avaliação criada com sucesso:", data);
		},
	});

	function onSubmit(dataForm: FormEmotionValues) {
		const dataCriar: AvaliacaoSentimentoCriar = {
			...dataForm,
			usuarioId: 1,
		};

		mutate(dataCriar);
	}

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
			<FormEmotion onSubmit={onSubmit} isPending={isPending} />
		</main>
	);
}
