import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { Clock3, Moon, Pencil, Plus, Trash2 } from "lucide-react";
import {
	deletarRelatoHigieneSono,
	listarRelatosHigieneSono,
} from "@/api/higiene-sono/higiene-sono.service";
import type { RelatoHigieneSono } from "@/api/higiene-sono/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";

export const Route = createFileRoute("/higieneSono/")({
	component: HigieneSonoPage,
});

const qualidadeLabels: Record<RelatoHigieneSono["qualidadeSono"], string> = {
	PESSIMA: "Péssima",
	RUIM: "Ruim",
	REGULAR: "Regular",
	BOA: "Boa",
	EXCELENTE: "Excelente",
};

const disposicaoLabels: Record<RelatoHigieneSono["nivelDisposicao"], string> = {
	MUITO_BAIXA: "Muito baixa",
	BAIXA: "Baixa",
	MEDIA: "Média",
	ALTA: "Alta",
	MUITO_ALTA: "Muito alta",
};

function formatarData(data: string) {
	const [ano, mes, dia] = data.split("-");
	return `${dia}/${mes}/${ano}`;
}

function formatarDuracao(minutos: number) {
	const horas = Math.floor(minutos / 60);
	const minutosRestantes = minutos % 60;
	if (horas === 0) return `${minutosRestantes} min`;
	if (minutosRestantes === 0) return `${horas} h`;
	return `${horas} h ${minutosRestantes} min`;
}

function HigieneSonoPage() {
	const usuarioId = obterUsuarioId();
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["higiene-sono", usuarioId],
		queryFn: () => listarRelatosHigieneSono(usuarioId),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deletarRelatoHigieneSono(usuarioId, id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["higiene-sono", usuarioId] });
			toast.add({
				title: "Registro excluído",
				description: "O relato de sono foi removido.",
				type: "success",
			});
		},
		onError: (deleteError: AxiosError<ErrorResponse>) => {
			toast.add({
				title: "Não foi possível excluir",
				description:
					deleteError.response?.data?.message ?? "Tente novamente mais tarde.",
				type: "error",
			});
		},
	});

	function excluir(id: number) {
		if (window.confirm("Excluir este registro de higiene do sono?")) {
			deleteMutation.mutate(id);
		}
	}

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-8 p-4">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<span className="flex size-11 items-center justify-center rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200">
						<Moon aria-hidden="true" className="size-5" />
					</span>
					<div>
						<Heading as="h1" variant="h3">
							Higiene do sono
						</Heading>
						<p className="text-sm text-muted-foreground">
							Acompanhe seus horários, descanso e disposição ao acordar.
						</p>
					</div>
				</div>
				<Link
					to="/higieneSono/criar"
					className={buttonVariants({ variant: "default" })}
				>
					<Plus aria-hidden="true" />
					Novo registro
				</Link>
			</header>

			{isPending && (
				<div className="grid gap-4 md:grid-cols-2">
					<Skeleton className="h-48" />
					<Skeleton className="h-48" />
				</div>
			)}

			{isError && (
				<p
					role="alert"
					className="rounded-md border border-destructive/40 p-4 text-sm"
				>
					Não foi possível carregar os registros: {error.message}
				</p>
			)}

			{!isPending && !isError && data?.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center gap-3 py-12 text-center">
						<Moon aria-hidden="true" className="size-8 text-muted-foreground" />
						<h2 className="text-lg font-semibold">
							Não há relatos disponíveis
						</h2>
						<p className="max-w-md text-sm text-muted-foreground">
							Registre seus horários de descanso para acompanhar seus hábitos ao
							longo do tempo.
						</p>
						<Link
							to="/higieneSono/criar"
							className={buttonVariants({ variant: "outline" })}
						>
							<Plus aria-hidden="true" />
							Registrar noite
						</Link>
					</CardContent>
				</Card>
			)}

			{data && data.length > 0 && (
				<section
					aria-label="Registros de sono"
					className="grid gap-4 md:grid-cols-2"
				>
					{data.map((relato) => (
						<Card key={relato.id}>
							<CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
								<div>
									<p className="text-sm text-muted-foreground">
										{formatarData(relato.dataRegistro)}
									</p>
									<CardTitle className="mt-1 text-lg">
										{qualidadeLabels[relato.qualidadeSono]} qualidade do sono
									</CardTitle>
								</div>
								<div className="flex gap-1">
									<Link
										to="/higieneSono/$id/editar"
										params={{ id: String(relato.id) }}
										aria-label="Editar registro"
										title="Editar registro"
										className={buttonVariants({
											variant: "ghost",
											size: "icon",
										})}
									>
										<Pencil aria-hidden="true" className="size-4" />
									</Link>
									<button
										type="button"
										aria-label="Excluir registro"
										title="Excluir registro"
										disabled={deleteMutation.isPending}
										onClick={() => excluir(relato.id)}
										className={buttonVariants({
											variant: "ghost",
											size: "icon",
										})}
									>
										<Trash2 aria-hidden="true" className="size-4" />
									</button>
								</div>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
									<span className="inline-flex items-center gap-2">
										<Clock3
											aria-hidden="true"
											className="size-4 text-muted-foreground"
										/>
										{relato.horaDormir.slice(0, 5)}–
										{relato.horaAcordar.slice(0, 5)}
									</span>
									<span className="font-medium">
										{formatarDuracao(relato.duracaoSonoMinutos)} de sono
									</span>
								</div>
								<dl className="grid grid-cols-2 gap-3 text-sm">
									<div>
										<dt className="text-muted-foreground">Disposição</dt>
										<dd className="font-medium">
											{disposicaoLabels[relato.nivelDisposicao]}
										</dd>
									</div>
									<div>
										<dt className="text-muted-foreground">Antes de dormir</dt>
										<dd className="font-medium">
											{relato.usouCelular ? "Usou celular" : "Sem celular"}
										</dd>
									</div>
								</dl>
								{(relato.tevePesadelos || relato.comentarioSonhos) && (
									<div className="border-t pt-3 text-sm">
										{relato.tevePesadelos && (
											<p className="mb-1 font-medium">Relatou pesadelos</p>
										)}
										{relato.comentarioSonhos && (
											<p className="whitespace-pre-wrap text-muted-foreground">
												{relato.comentarioSonhos}
											</p>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</section>
			)}
		</main>
	);
}
