import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	editarAvaliacaoSentimento,
	obterAvaliacaoSentimento,
	type EditarAvaliacaoParams,
} from "@/api/avaliacao-sentimento/avalicao-sentimento.service";
import { Heading } from "@/components/-/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { FormEmotion } from "./-components/form";
import { FormSkeleton } from "./-components/skeleton-form";
import { queryClient } from "@/lib/react-query";
import type { AvaliacaoSentimentoInput } from "@/api/avaliacao-sentimento/schema";

export const Route = createFileRoute("/sentimentos/$dataRegistro/editar")({
	loader: ({ params }) => {
		const { dataRegistro } = params;

		if (!dataRegistro) {
			throw redirect({
				to: "/sentimentos",
			});
		}
		return { dataRegistro };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const useQueryClient = queryClient;
	const { dataRegistro } = Route.useLoaderData();
	const navigate = useNavigate();

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: editarAvaliacaoSentimento,
		onSuccess: async () => {
			useQueryClient.invalidateQueries({ queryKey: ["feelings"] });
			useQueryClient.invalidateQueries({ queryKey: ["avalicao-sentimento"] });
			await navigate({
				to: "/sentimentos",
			});
		},
	});

	const { data, isSuccess: isQuerySuccess, isPending: isQueryPending } = useQuery({
		queryKey: ["avalicao-sentimento"],
		queryFn: () => obterAvaliacaoSentimento(1, dataRegistro),
		staleTime: 1000 * 60 * 5,
	});

	function onSubmit(dados: AvaliacaoSentimentoInput) {
		const dataEditar: EditarAvaliacaoParams = {
			usuarioId: 1,
			dataRegistro,
			dados,
		};

		mutate(dataEditar);
	}

	if (isQueryPending) {
		return (
			<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
				<header className="flex flex-col gap-4">
					<Skeleton className="h-12 w-72 max-w-full" />
					<Skeleton className="h-4 w-full max-w-2xl" />
				</header>
				<FormSkeleton />
			</main>
		);
	}

	if (isQuerySuccess) {
		if (data) {
			const initialValues: AvaliacaoSentimentoInput = {
				avaliacaoDia: data.avaliacaoDia,
				sentimentos: data.sentimentos,
				gatilhos: data.gatilhos,
				textoLivre: data.textoLivre,
			};

			return (
				<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
					<header className="flex flex-col gap-4">
						<Heading as="h1" variant="h1">
							{dataRegistro}
						</Heading>

						<p>
							Preencha os campos abaixo para registrar uma nova avaliação de
							sentimento.
						</p>
					</header>
					<FormEmotion
						onSubmit={onSubmit}
						initialValues={initialValues}
						isPending={isPending}
						isSuccess={isSuccess}
					/>
				</main>
			);
		}
	}
}
