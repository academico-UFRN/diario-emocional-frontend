import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { Brain, Pencil, Plus, Trash2 } from "lucide-react";
import { deletarRegistroRpd, listarRegistrosRpd } from "@/api/rpd/rpd.service";
import type { RpdResponse } from "@/api/rpd/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { obterUsuarioId } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";

export const Route = createFileRoute("/rpd/")({
	component: RpdPage,
});

function formatarDataHora(dataHora: string) {
	const [data, hora = ""] = dataHora.split("T");
	const [ano, mes, dia] = data.split("-");
	return `${dia}/${mes}/${ano} às ${hora.slice(0, 5)}`;
}

function CampoRegistro({
	titulo,
	conteudo,
}: {
	titulo: string;
	conteudo: string | null;
}) {
	if (!conteudo?.trim()) return null;
	return (
		<div>
			<dt className="text-muted-foreground">{titulo}</dt>
			<dd className="whitespace-pre-wrap font-medium">{conteudo}</dd>
		</div>
	);
}

function RegistroCard({
	registro,
	onExcluir,
	isDeleting,
}: {
	registro: RpdResponse;
	onExcluir: (id: number) => void;
	isDeleting: boolean;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
				<div>
					<p className="text-sm text-muted-foreground">
						{formatarDataHora(registro.dataHoraRegistro)}
					</p>
					<CardTitle className="mt-1 text-lg">Pensamento automático</CardTitle>
				</div>
				<div className="flex gap-1">
					<Link
						to="/rpd/$id/editar"
						params={{ id: String(registro.id) }}
						aria-label="Editar registro RPD"
						title="Editar registro"
						className={buttonVariants({ variant: "ghost", size: "icon" })}
					>
						<Pencil aria-hidden="true" className="size-4" />
					</Link>
					<button
						type="button"
						aria-label="Excluir registro RPD"
						title="Excluir registro"
						disabled={isDeleting}
						onClick={() => onExcluir(registro.id)}
						className={buttonVariants({ variant: "ghost", size: "icon" })}
					>
						<Trash2 aria-hidden="true" className="size-4" />
					</button>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<p className="whitespace-pre-wrap font-medium">
					{registro.pensamentoAutomatico}
				</p>
				<div className="flex flex-wrap items-center gap-2 text-sm">
					<span className="rounded-full bg-secondary px-3 py-1">
						Intensidade inicial: {registro.intensidadeCrise}/10
					</span>
					{registro.intensidadeReavaliada != null && (
						<span className="rounded-full bg-secondary px-3 py-1">
							Reavaliada: {registro.intensidadeReavaliada}/10
						</span>
					)}
				</div>
				{registro.emocoesPrincipais.length > 0 && (
					<div>
						<p className="mb-1 text-sm text-muted-foreground">
							Emoções principais
						</p>
						<div className="flex flex-wrap gap-2">
							{Array.from(new Set(registro.emocoesPrincipais)).map((emocao) => (
								<span
									key={emocao}
									className="rounded-full border px-3 py-1 text-sm"
								>
									{emocao}
								</span>
							))}
						</div>
					</div>
				)}
				{registro.distorcoesCognitivas.length > 0 && (
					<div>
						<p className="mb-1 text-sm text-muted-foreground">
							Distorções cognitivas
						</p>
						<div className="flex flex-wrap gap-2">
							{Array.from(new Set(registro.distorcoesCognitivas)).map(
								(distorcao) => (
									<span
										key={distorcao}
										className="rounded-full border px-3 py-1 text-sm"
									>
										{distorcao}
									</span>
								),
							)}
						</div>
					</div>
				)}
				<dl className="grid gap-3 border-t pt-3 text-sm sm:grid-cols-2">
					<CampoRegistro
						titulo="Situação ou gatilho"
						conteudo={registro.gatilhoSituacao}
					/>
					<CampoRegistro
						titulo="Evidências e contra-argumentos"
						conteudo={registro.evidenciasContraArgumento}
					/>
					<CampoRegistro
						titulo="Pensamento alternativo"
						conteudo={registro.pensamentoAlternativo}
					/>
				</dl>
			</CardContent>
		</Card>
	);
}

function RpdPage() {
	const usuarioId = obterUsuarioId();
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["rpd", usuarioId],
		queryFn: () => listarRegistrosRpd(usuarioId),
	});
	const deleteMutation = useMutation({
		mutationFn: (id: number) => deletarRegistroRpd(usuarioId, id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["rpd", usuarioId] });
			toast.add({
				title: "Registro excluído",
				description: "O registro RPD foi removido.",
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
		if (window.confirm("Excluir este registro de pensamentos?")) {
			deleteMutation.mutate(id);
		}
	}

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-8 p-4">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<span className="flex size-11 items-center justify-center rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200">
						<Brain aria-hidden="true" className="size-5" />
					</span>
					<div>
						<Heading as="h1" variant="h3">
							Registro de pensamentos (RPD)
						</Heading>
						<p className="text-sm text-muted-foreground">
							Observe seus pensamentos e reavalie como se sente.
						</p>
					</div>
				</div>
				<Link
					to="/rpd/criar"
					className={buttonVariants({ variant: "default" })}
				>
					<Plus aria-hidden="true" />
					Novo registro
				</Link>
			</header>

			{isPending && (
				<div className="grid gap-4 md:grid-cols-2">
					<Skeleton className="h-56" />
					<Skeleton className="h-56" />
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
						<Brain
							aria-hidden="true"
							className="size-8 text-muted-foreground"
						/>
						<h2 className="text-lg font-semibold">
							Nenhum registro de pensamento
						</h2>
						<p className="max-w-md text-sm text-muted-foreground">
							Registre uma situação, os pensamentos que surgiram e como se
							sentiu.
						</p>
						<Link
							to="/rpd/criar"
							className={buttonVariants({ variant: "outline" })}
						>
							<Plus aria-hidden="true" />
							Criar primeiro registro
						</Link>
					</CardContent>
				</Card>
			)}

			{data && data.length > 0 && (
				<section
					aria-label="Registros de pensamentos"
					className="grid gap-4 md:grid-cols-2"
				>
					{data.map((registro) => (
						<RegistroCard
							key={registro.id}
							registro={registro}
							onExcluir={excluir}
							isDeleting={deleteMutation.isPending}
						/>
					))}
				</section>
			)}
		</main>
	);
}
