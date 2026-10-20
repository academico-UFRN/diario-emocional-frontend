import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { criarRegistroRpd } from "@/api/rpd/rpd.service";
import type { RpdRequest } from "@/api/rpd/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { RpdForm } from "./-components/form";

export const Route = createFileRoute("/rpd/criar")({
	component: CriarRpdPage,
});

function CriarRpdPage() {
	const navigate = useNavigate();
	const usuarioId = obterUsuarioId();
	const mutation = useMutation({
		mutationFn: (dados: RpdRequest) => criarRegistroRpd(usuarioId, dados),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rpd", usuarioId] });
			toast.add({
				title: "Registro salvo",
				description: "Seu registro de pensamentos foi adicionado.",
				type: "success",
			});
			await navigate({ to: "/rpd" });
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
						Novo registro de pensamentos
					</Heading>
					<p className="mt-2 text-sm text-muted-foreground">
						Registre a situação, seus pensamentos e como se sentiu.
					</p>
				</div>
				<Link to="/rpd" className={buttonVariants({ variant: "outline" })}>
					Voltar aos registros
				</Link>
			</header>
			<RpdForm
				onSubmit={(dados) => mutation.mutate(dados)}
				isPending={mutation.isPending}
			/>
		</main>
	);
}
