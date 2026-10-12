import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { criarRelatoHigieneSono } from "@/api/higiene-sono/higiene-sono.service";
import type { RelatoHigieneSonoRequest } from "@/api/higiene-sono/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { HigieneSonoForm } from "./-components/form";

export const Route = createFileRoute("/higieneSono/criar")({
	component: CriarHigieneSonoPage,
});

function CriarHigieneSonoPage() {
	const navigate = useNavigate();
	const usuarioId = obterUsuarioId();
	const mutation = useMutation({
		mutationFn: (dados: RelatoHigieneSonoRequest) =>
			criarRelatoHigieneSono(usuarioId, dados),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["higiene-sono", usuarioId] });
			toast.add({
				title: "Registro salvo",
				description: "Seu relato de higiene do sono foi adicionado.",
				type: "success",
			});
			await navigate({ to: "/higieneSono" });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.add({
				title: "Não foi possível salvar",
				description:
					error.response?.data?.message ??
					"Confira os dados e tente novamente.",
				type: "error",
			});
		},
	});

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-6 p-4">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<Heading as="h1" variant="h3">
						Novo registro de sono
					</Heading>
					<p className="mt-2 text-sm text-muted-foreground">
						Registre como foi sua noite e como se sentiu ao acordar.
					</p>
				</div>
				<Link
					to="/higieneSono"
					className={buttonVariants({ variant: "outline" })}
				>
					Voltar aos registros
				</Link>
			</header>
			<HigieneSonoForm
				onSubmit={(dados) => mutation.mutate(dados)}
				isPending={mutation.isPending}
			/>
		</main>
	);
}
