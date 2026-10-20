import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { buscarRegistroRpd, editarRegistroRpd } from "@/api/rpd/rpd.service";
import type { RpdRequest } from "@/api/rpd/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { RpdForm } from "./-components/form";

export const Route = createFileRoute("/rpd/$id/editar")({
	component: EditarRpdPage,
});

function EditarRpdPage() {
	const { id: idParam } = Route.useParams();
	const id = Number(idParam);
	const navigate = useNavigate();
	const usuarioId = obterUsuarioId();
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["rpd", usuarioId, id],
		queryFn: () => buscarRegistroRpd(usuarioId, id),
		enabled: Number.isInteger(id) && id > 0,
	});
	const mutation = useMutation({
		mutationFn: (dados: RpdRequest) => editarRegistroRpd(usuarioId, id, dados),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rpd", usuarioId] });
			toast.add({
				title: "Registro atualizado",
				description: "As alterações foram salvas.",
				type: "success",
			});
			await navigate({ to: "/rpd" });
		},
		onError: (editError: AxiosError<ErrorResponse>) => {
			toast.add({
				title: "Não foi possível atualizar",
				description:
					editError.response?.data?.message ??
					"Confira os dados e tente novamente.",
				type: "error",
			});
		},
	});

	if (!Number.isInteger(id) || id < 1) {
		return (
			<p role="alert" className="p-4">
				Identificador de registro inválido.
			</p>
		);
	}

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-6 p-4">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<Heading as="h1" variant="h3">
						Editar registro de pensamentos
					</Heading>
					<p className="mt-2 text-sm text-muted-foreground">
						Atualize as informações deste registro.
					</p>
				</div>
				<Link to="/rpd" className={buttonVariants({ variant: "outline" })}>
					Voltar aos registros
				</Link>
			</header>

			{isPending && <Skeleton className="h-72" />}
			{isError && (
				<p
					role="alert"
					className="rounded-md border border-destructive/40 p-4 text-sm"
				>
					Não foi possível carregar o registro: {error.message}
				</p>
			)}
			{data && (
				<RpdForm
					initialData={{
						intensidadeCrise: data.intensidadeCrise,
						emocoesPrincipais: data.emocoesPrincipais,
						gatilhoSituacao: data.gatilhoSituacao ?? "",
						pensamentoAutomatico: data.pensamentoAutomatico,
						distorcoesCognitivas: data.distorcoesCognitivas,
						evidenciasContraArgumento: data.evidenciasContraArgumento ?? "",
						pensamentoAlternativo: data.pensamentoAlternativo ?? "",
						intensidadeReavaliada: data.intensidadeReavaliada ?? undefined,
					}}
					onSubmit={(dados) => mutation.mutate(dados)}
					isPending={mutation.isPending}
				/>
			)}
		</main>
	);
}
