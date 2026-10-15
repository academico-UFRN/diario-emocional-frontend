import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import {
	CriarSolicitacaoSaudeMental,
	ListarSolicitacoesSaudeMental,
} from "@/api/sugestao-saude-mental/sugestao-saude-mental.service";
import type {
	SolicitacaoSaudeMental,
} from "@/api/sugestao-saude-mental/schema";
import { Heading } from "@/components/-/typography";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { obterUsuarioId } from "@/lib/auth";

export const Route = createFileRoute("/sugestoes-saude-mental/")({
	component: RouteComponent,
});

function formatarData(data: string) {
	if (!data) return "Data não informada";
	const [ano, mes, dia] = data.split("-");
	return `${dia}/${mes}/${ano}`;
}

function CartaoSolicitacao({
	solicitacao,
}: {
	solicitacao: SolicitacaoSaudeMental;
}) {
	const sugestoes = solicitacao.sugestoes ?? [];
	const [indiceSugestao] = useState(() =>
		Math.floor(Math.random() * Math.max(sugestoes.length, 1)),
	);
	const sugestaoSelecionada = sugestoes[indiceSugestao];
	const idDisponivel = typeof solicitacao.id === "number";
	const cartao = (
		<Card className="h-full transition-colors hover:bg-muted/60">
			<CardHeader>
				<CardTitle>{formatarData(solicitacao.dataRegistro)}</CardTitle>
			</CardHeader>
			{sugestaoSelecionada && (
				<CardContent>
					<div className="rounded-xl border p-4">
						<p className="font-medium">{sugestaoSelecionada.acao}</p>
						{idDisponivel && (
							<p className="mt-2 text-xs text-muted-foreground">
								Ver sugestão completa
							</p>
						)}
					</div>
				</CardContent>
			)}
		</Card>
	);

	if (!idDisponivel) return cartao;

	return (
		<Link
			to="/sugestoes-saude-mental/$solicitacaoId"
			params={{ solicitacaoId: String(solicitacao.id) }}
			className="block rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			aria-label={`Ver sugestão completa de ${formatarData(solicitacao.dataRegistro)}`}
		>
			{cartao}
		</Link>
	);
}

function RouteComponent() {
	const usuarioId = obterUsuarioId();
	const queryClient = useQueryClient();
	const queryKey = ["sugestoesSaudeMental", usuarioId];
	const { data, isLoading, isError } = useQuery({
		queryKey,
		queryFn: () => ListarSolicitacoesSaudeMental(usuarioId),
	});
	const mutation = useMutation({
		mutationFn: () => CriarSolicitacaoSaudeMental(usuarioId),
		onSuccess: () => queryClient.invalidateQueries({ queryKey }),
	});
	const identificadorAusente = data?.some(
		(solicitacao) => typeof solicitacao.id !== "number",
	);

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-8 p-4">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<Heading as="h1" variant="h3">
						Sugestões de saúde mental
					</Heading>
					<p className="mt-2 text-muted-foreground">
						Ideias personalizadas para apoiar seu bem-estar.
					</p>
				</div>
				<Button
					onClick={() => mutation.mutate()}
					disabled={mutation.isPending}
				>
					<Sparkles aria-hidden="true" />
					{mutation.isPending ? "Gerando sugestões..." : "Gerar sugestões com IA"}
				</Button>
			</header>

			{mutation.isError && (
				<p role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
					Não foi possível gerar sugestões. Tente novamente.
				</p>
			)}
			{isError && (
				<p role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
					Não foi possível carregar suas sugestões.
				</p>
			)}
			{identificadorAusente && (
				<p role="status" className="rounded-md border p-3 text-sm text-muted-foreground">
					O servidor não enviou o identificador da solicitação. Os detalhes individuais
					ficarão disponíveis quando o identificador for incluído na resposta.
				</p>
			)}

			{isLoading ? (
				<p role="status" className="text-muted-foreground">Carregando sugestões...</p>
			) : data?.length ? (
				<section className="grid gap-4 md:grid-cols-2" aria-label="Sugestões geradas">
					{data.map((solicitacao, indice) => (
						<CartaoSolicitacao
							key={solicitacao.id ?? `${solicitacao.dataRegistro}-${indice}`}
							solicitacao={solicitacao}
						/>
					))}
				</section>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Nenhuma sugestão gerada</CardTitle>
						<CardDescription>
							Gere uma primeira lista para começar.
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</main>
	);
}