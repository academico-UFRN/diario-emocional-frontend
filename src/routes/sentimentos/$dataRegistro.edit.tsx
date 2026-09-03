import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	EditarAvaliacaoSentimento,
	ListarAvaliacoesSentimento,
} from "@/api/avaliacao-sentimento/avalicao-sentimento.service";
import type { AvaliacaoSentimentoEditar } from "@/api/avaliacao-sentimento/schema";
import { Heading } from "@/components/others/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { FormEmotion, type FormEmotionValues } from "./-components/form";
import { FormSkeleton } from "./-components/skeleton-form";

export const Route = createFileRoute("/sentimentos/$dataRegistro/edit")({
	loader: async ({ params }) => {
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
	const { dataRegistro } = Route.useLoaderData();
	const navigate = useNavigate();

	const { mutate, isPending } = useMutation({
		mutationFn: EditarAvaliacaoSentimento,
		onSuccess: async (data) => {
			console.log("Avaliação editada com sucesso:", data);
			await navigate({
				to: "/sentimentos",
			});
		},
	});

	const {
		data,
		isSuccess,
		isPending: isQueryPending,
	} = useQuery({
		queryKey: ["feelings"],
		queryFn: () => ListarAvaliacoesSentimento(1),
		staleTime: 1000 * 60 * 5,
	});

	function onSubmit(dataForm: FormEmotionValues) {
		const dataEditar: AvaliacaoSentimentoEditar = {
			...dataForm,
			usuarioId: 1,
			dataRegistro: dataRegistro,
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

	if (isSuccess) {
		const avaliacao = data.find(
			(avaliacao) => avaliacao.dataRegistro === dataRegistro,
		);
		if (avaliacao) {
			const initialValues: FormEmotionValues = {
				avaliacaoDia: avaliacao.avaliacaoDia,
				sentimentos: avaliacao.sentimentos,
				gatilhos: avaliacao.gatilhos,
				textoLivre: avaliacao.textoLivre,
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
					/>
				</main>
			);
		}
	}
}
