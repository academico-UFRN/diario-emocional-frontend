import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { criarAvaliacaoSentimento } from "@/api/avaliacao-sentimento/avalicao-sentimento.service";
import type {
	AvaliacaoSentimento,
	AvaliacaoSentimentoInput,
} from "@/api/avaliacao-sentimento/schema";
import { Heading } from "@/components/-/typography";
import { FormEmotion } from "./-components/form";
import { queryClient } from "@/lib/react-query";
import { toast } from "@/components/ui/toast";
import type { ErrorResponse } from "@/api/schemas";
import type { AxiosError } from "axios";

export const Route = createFileRoute("/sentimentos/criar")({
	component: RouteComponent,
});

function RouteComponent() {
	const useQueryClient = queryClient;
	const navigate = useNavigate();

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: criarAvaliacaoSentimento,
		onSuccess: (newEvaluation) => {
			useQueryClient.setQueryData<AvaliacaoSentimento[]>(
				["feelings"],
				(currentEvaluations: AvaliacaoSentimento[] = []) => [
					newEvaluation,
					...currentEvaluations,
				],
			);
			toast.add({
				title: "Sucesso",
				description: "Avaliação adicionada com sucesso.",
				type: "success",
			});
			navigate({
				to: "/sentimentos",
			});
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.add({
				title: error.response?.data?.status && error.response?.data?.error ? `${error.response?.data?.status} - ${error.response?.data?.error}` : "Erro",
				description: error.response?.data?.message || `Ocorreu um erro ao adicionar a avaliação: ${error}`,
				type: "error",
			});
		},
	});

	function onSubmit(dados: AvaliacaoSentimentoInput) {
		mutate({
			usuarioId: 1,
			dados,
		});
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
			<FormEmotion onSubmit={onSubmit} isPending={isPending} isSuccess={isSuccess} />
		</main>
	);
}
