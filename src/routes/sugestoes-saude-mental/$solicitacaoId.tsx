import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BuscarSolicitacaoSaudeMental } from "@/api/sugestao-saude-mental/sugestao-saude-mental.service";
import type { SugestaoSaudeMental } from "@/api/sugestao-saude-mental/schema";
import { Heading } from "@/components/-/typography";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { obterUsuarioId } from "@/lib/auth";

export const Route = createFileRoute("/sugestoes-saude-mental/$solicitacaoId")({
	component: RouteComponent,
});

function formatarData(data: string) {
	if (!data) return "Data não informada";
	const [ano, mes, dia] = data.split("-");
	return `${dia}/${mes}/${ano}`;
}

function RouteComponent() {
	const usuarioId = obterUsuarioId();
	const { solicitacaoId: idParam } = useParams({ from: Route.id });
	const solicitacaoId = Number(idParam);
	const { data, isLoading, isError } = useQuery({
		queryKey: ["sugestaoSaudeMental", usuarioId, solicitacaoId],
		queryFn: () => BuscarSolicitacaoSaudeMental(usuarioId, solicitacaoId),
		enabled: Number.isInteger(solicitacaoId) && solicitacaoId > 0,
	});
	const sugestoes = data?.sugestoes ?? [];

	return (
		<main className="mx-auto flex w-full max-w-270 flex-col gap-6 p-4">
			<Link
				to="/sugestoes-saude-mental"
				className={buttonVariants({ variant: "ghost", className: "w-fit" })}
			>
				<ArrowLeft aria-hidden="true" />
				Voltar às sugestões
			</Link>

			{isLoading && <p role="status">Carregando sugestão...</p>}
			{isError && (
				<p role="alert" className="text-destructive">
					Não foi possível carregar esta solicitação.
				</p>
			)}
			{!isLoading && !isError && data && (
				<>
					<header>
						<Heading as="h1" variant="h3">
							Sugestões de saúde mental
						</Heading>
						<p className="mt-2 text-muted-foreground">
							Geradas em {formatarData(data.dataRegistro)}
						</p>
					</header>
					{sugestoes.length > 0 ? (
						<div className="flex flex-col gap-4">
							{sugestoes.map((sugestao, indice) => (
								<Card key={indice}>
									<CardContent className="flex flex-col gap-5">
										<section>
											<h2 className="font-medium">Ação</h2>
											<p className="mt-1 whitespace-pre-wrap text-muted-foreground">
												{sugestao.acao}
											</p>
										</section>
										<section>
											<h2 className="font-medium">Motivo</h2>
											<p className="mt-1 whitespace-pre-wrap text-muted-foreground">
												{sugestao.motivo}
											</p>
										</section>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">
							Não há sugestões disponíveis para esta solicitação.
						</p>
					)}
				</>
			)}
		</main>
	);
}