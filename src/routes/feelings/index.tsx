import { Delete, Edit } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ListarAvaliacoesSentimento } from "@/api/avaliacao-sentimento/avalicao-sentimento.service";
import { Heading } from "@/components/others/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FREQUENCY_LABELS, GATILHOS, SENTIMENTOS } from "./novo/-data-emotion";

export const Route = createFileRoute("/feelings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useQuery({
		queryKey: ["feelings"],
		queryFn: () => ListarAvaliacoesSentimento(1),
	});

	return (
		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<Heading as="h1" variant="h1">
					Avaliação de Sentimentos
				</Heading>
				<p>
					Aqui você pode editar, deletar e acompanhar seus sentimentos ao longo
					do tempo.
				</p>
			</header>
			{data?.map((avaliacao) => (
				<Card key={`${avaliacao.usuario.id}-${avaliacao.dataRegistro}`}>
					<CardHeader className="flex items-center gap-4">
						<div className="size-12 flex items-center justify-center rounded-full bg-primary/20 text-2xl">
							{avaliacao.avaliacaoDia === 5
								? "😊"
								: avaliacao.avaliacaoDia === 4
									? "🙂"
									: avaliacao.avaliacaoDia === 3
										? "😐"
										: avaliacao.avaliacaoDia === 2
											? "🙁"
											: avaliacao.avaliacaoDia === 1
												? "😞"
												: avaliacao.avaliacaoDia === 0
													? "😢"
													: "❓"}
						</div>
						<div>
							<CardTitle>{avaliacao.dataRegistro}</CardTitle>
							<CardDescription>
								{avaliacao.avaliacaoDia === 5
									? "Dia sensacional! ✨"
									: avaliacao.avaliacaoDia === 4
										? "Dia muito bom!"
										: avaliacao.avaliacaoDia === 3
											? "Dia normal"
											: avaliacao.avaliacaoDia === 2
												? "Dia ruim, vai ficar tudo bem!"
												: avaliacao.avaliacaoDia === 1
													? "Dia péssimo, mas cuide-se"
													: avaliacao.avaliacaoDia === 0}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<p>{avaliacao.textoLivre}</p>
						<div className="h-px w-full bg-border rounded-full " />

						<div className="flex flex-wrap gap-2">
							{avaliacao.sentimentos.map((sentimento) => {
								const feeling = SENTIMENTOS.find(
									(item) => item.id === sentimento.sentimento,
								);
								if (!feeling) {
									console.warn(
										`Sentimento com id "${sentimento.sentimento}" não encontrado em especificFeelingsToChoose.`,
									);
									return null;
								}
								return (
									<Badge variant="secondary" key={sentimento.sentimento}>
										<HugeiconsIcon
											icon={feeling.icon}
											strokeWidth={3}
											color={feeling.primaryColor}
										/>
										<p className="flex items-center gap-1">{feeling.name}</p>
										<div className="h-1 w-1 bg-muted-foreground rounded-full"></div>

										<p className="text-muted-foreground">
											{FREQUENCY_LABELS[sentimento.intensidade - 1] ||
												"Intensidade desconhecida"}
										</p>
									</Badge>
								);
							})}
						</div>
						<div className="flex flex-wrap gap-2">
							{avaliacao.gatilhos.map((gatilho) => {
								const gatilhoData = GATILHOS.find(
									(item) => item.id === gatilho,
								);
								if (!gatilhoData) {
									console.warn(
										`Gatilho com id "${gatilho}" não encontrado em GATILHOS.`,
									);
									return null;
								}

								return (
									<Badge variant="outline" key={gatilho}>
										<HugeiconsIcon icon={gatilhoData.icon} strokeWidth={2} />
										<p>{gatilhoData.name}</p>
									</Badge>
								);
							})}
						</div>
						<div className="h-px w-full bg-border rounded-full " />
					</CardContent>
					<CardFooter className="flex justify-end gap-2">
						<Button variant="outline" className="">
							<HugeiconsIcon icon={Edit} strokeWidth={2} />
							Editar Avaliação
						</Button>
						<Button variant="destructive" className="">
							<HugeiconsIcon icon={Delete} strokeWidth={2} />
							Deletar Avaliação
						</Button>
					</CardFooter>
				</Card>
			))}
		</main>
	);
}
