import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import {
	buscarRelatoHigieneSono,
	editarRelatoHigieneSono,
} from "@/api/higiene-sono/higiene-sono.service";
import type { RelatoHigieneSonoRequest } from "@/api/higiene-sono/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { HigieneSonoForm } from "./-components/form";

export const Route = createFileRoute("/higieneSono/$id/editar")({
	component: EditarHigieneSonoPage,
});

function EditarHigieneSonoPage() {
	const { id: idParam } = Route.useParams();
	const id = Number(idParam);
	const navigate = useNavigate();
	const usuarioId = obterUsuarioId();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["higiene-sono", usuarioId, id],
		queryFn: () => buscarRelatoHigieneSono(usuarioId, id),
		enabled: Number.isInteger(id) && id > 0,
	});

	const mutation = useMutation({
		mutationFn: (dados: RelatoHigieneSonoRequest) =>
			editarRelatoHigieneSono(usuarioId, id, dados),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["higiene-sono", usuarioId] });
			toast.add({
				title: "Registro atualizado",
				description: "As alterações foram salvas.",
				type: "success",
			});
			await navigate({ to: "/higieneSono" });
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
						Editar registro de sono
					</Heading>
					<p className="mt-2 text-sm text-muted-foreground">
						Atualize os dados desta noite de descanso.
					</p>
				</div>
				<Link
					to="/higieneSono"
					className={buttonVariants({ variant: "outline" })}
				>
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
				<HigieneSonoForm
					initialData={{
						dataRegistro: data.dataRegistro,
						horaDormir: data.horaDormir.slice(0, 5),
						horaAcordar: data.horaAcordar.slice(0, 5),
						qualidadeSono: data.qualidadeSono,
						usouCelular: data.usouCelular,
						tevePesadelos: data.tevePesadelos,
						comentarioSonhos: data.comentarioSonhos ?? "",
						nivelDisposicao: data.nivelDisposicao,
					}}
					onSubmit={(dados) => mutation.mutate(dados)}
					isPending={mutation.isPending}
				/>
			)}
		</main>
	);
}
