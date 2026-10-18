import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	differenceInCalendarDays,
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isSameDay,
	startOfMonth,
	subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import type {
	StreakPeriod,
	StreakPeriodItem,
} from "@/api/streak-period/schema";
import { buscarStreakPeriod } from "@/api/streak-period/streak-period.service";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { obterUsuarioIdSalvo } from "@/lib/auth";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function parsearDataLocal(dataIso: string): Date {
	const [ano, mes, dia] = dataIso.split("-").map(Number);
	return new Date(ano, mes - 1, dia);
}

function formatarDataCurta(dataIso?: string | null): string {
	if (!dataIso) return "--/--/----";
	const [ano, mes, dia] = dataIso.split("-");
	if (!ano || !mes || !dia) return dataIso;
	return `${dia}/${mes}/${ano}`;
}

function gerarSemanasDoMes(mes: Date): (Date | null)[][] {
	const inicio = startOfMonth(mes);
	const fim = endOfMonth(mes);
	const dias = eachDayOfInterval({ start: inicio, end: fim });

	const offsetInicio = getDay(inicio);
	const celulas: (Date | null)[] = [
		...Array.from({ length: offsetInicio }, () => null),
		...dias,
	];

	while (celulas.length % 7 !== 0) {
		celulas.push(null);
	}

	const semanas: (Date | null)[][] = [];
	for (let i = 0; i < celulas.length; i += 7) {
		semanas.push(celulas.slice(i, i + 7));
	}

	return semanas;
}

function calcularOfensivaAtual(
	streakData?: StreakPeriod,
	hoje: Date = new Date(),
): {
	diasAtuais: number;
	fezRegistroHoje: boolean;
} {
	if (!streakData) {
		return { diasAtuais: 0, fezRegistroHoje: false };
	}

	const hojeNormalizado = new Date(
		hoje.getFullYear(),
		hoje.getMonth(),
		hoje.getDate(),
	);
	const hojeStr = format(hojeNormalizado, "yyyy-MM-dd");
	const datasUnicas = Array.from(new Set(streakData.datas ?? [])).sort();
	const datasSet = new Set(datasUnicas);

	const fezRegistroHoje = datasSet.has(hojeStr);

	const cursor = new Date(hojeNormalizado);
	if (!datasSet.has(format(cursor, "yyyy-MM-dd"))) {
		cursor.setDate(cursor.getDate() - 1);
	}

	let consecutivos = 0;
	while (datasSet.has(format(cursor, "yyyy-MM-dd"))) {
		consecutivos += 1;
		cursor.setDate(cursor.getDate() - 1);
	}

	if (consecutivos > 0) {
		return { diasAtuais: consecutivos, fezRegistroHoje };
	}

	const candidatos: (StreakPeriodItem | null | undefined)[] = [
		streakData.UltimaStreak,
		streakData.MaiorStreak,
	];

	for (const item of candidatos) {
		if (item?.dataFinal) {
			const fim = parsearDataLocal(item.dataFinal);
			const diff = differenceInCalendarDays(hojeNormalizado, fim);
			if (diff === 0 || diff === 1) {
				return {
					diasAtuais: item.qtdDias,
					fezRegistroHoje: diff === 0,
				};
			}
		}
	}

	return { diasAtuais: 0, fezRegistroHoje: false };
}

export function DuotoneFlameIcon({
	className,
	active = true,
}: {
	className?: string;
	active?: boolean;
}) {
	return (
		<span
			className={cn(
				"relative inline-flex items-center justify-center",
				className,
			)}
		>
			<Flame
				className={cn(
					"size-full transition-colors",
					active
						? "fill-orange-500 text-orange-600 dark:fill-orange-500 dark:text-orange-400"
						: "fill-muted-foreground/25 text-muted-foreground/45",
				)}
				strokeWidth={2}
			/>
			<Flame
				className={cn(
					"absolute bottom-[10%] size-[54%] transition-colors pointer-events-none",
					active
						? "fill-orange-300 text-orange-300 dark:fill-orange-300 dark:text-orange-200"
						: "fill-muted-foreground/20 text-transparent",
				)}
				strokeWidth={1.75}
			/>
		</span>
	);
}

interface StreakStatBlockProps {
	label: string;
	streak?: StreakPeriodItem | null;
	emptyDescription: string;
}

function StreakStatBlock({
	label,
	streak,
	emptyDescription,
}: StreakStatBlockProps) {
	const qtdDias = streak?.qtdDias ?? 0;

	return (
		<div className="flex h-full flex-col justify-between gap-1.5 rounded-2xl border border-border bg-card px-5 py-4">
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
			<strong className="text-xl font-bold tracking-tight text-foreground">
				{qtdDias} {qtdDias === 1 ? "dia" : "dias"}
			</strong>
			<p className="text-xs leading-relaxed text-muted-foreground">
				{streak
					? `De ${formatarDataCurta(streak.dataInicio)} até ${formatarDataCurta(streak.dataFinal)}`
					: emptyDescription}
			</p>
		</div>
	);
}

export function StreakDialog({ usuarioId: usuarioIdProp }: { usuarioId?: number } = {}) {
	const usuarioId = usuarioIdProp ?? (obterUsuarioIdSalvo() ?? undefined);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const { data: streakData, isPending } = useQuery({
		queryKey: ["streak-period", usuarioId],
		queryFn: () => {
			if (!usuarioId) {
				throw new Error("Usuário não autenticado");
			}
			return buscarStreakPeriod(usuarioId);
		},
		enabled: !!usuarioId,
	});

	const hoje = useMemo(() => {
		const agora = new Date();
		return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
	}, []);

	const datasSet = useMemo(() => {
		return new Set(streakData?.datas ?? []);
	}, [streakData?.datas]);

	const { diasAtuais, fezRegistroHoje } = useMemo(
		() => calcularOfensivaAtual(streakData, hoje),
		[streakData, hoje],
	);

	const ultimosTresMeses = useMemo(() => {
		const mesAtual = startOfMonth(hoje);
		return [subMonths(mesAtual, 2), subMonths(mesAtual, 1), mesAtual].map(
			(mes) => ({
				chave: format(mes, "yyyy-MM"),
				titulo: format(mes, "MMMM 'de' yyyy", { locale: ptBR }).toUpperCase(),
				semanas: gerarSemanasDoMes(mes),
			}),
		);
	}, [hoje]);

	function handleComecarOfensiva() {
		setOpen(false);
		const hojeFormatado = format(hoje, "yyyy-MM-dd");
		void navigate({
			to: "/relatoDia/criar/$dataRegistro",
			params: { dataRegistro: hojeFormatado },
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						className="flex items-center gap-1.5 px-3 font-bold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20"
						aria-label="Abrir ofensiva"
					/>
				}
			>
				<DuotoneFlameIcon active className="size-5" />
				<span className="tabular-nums text-sm">
					{isPending ? "..." : diasAtuais}
				</span>
			</DialogTrigger>

			<DialogContent className="sm:max-w-5xl p-8 gap-7">
				<DialogHeader className="sr-only">
					<DialogTitle>Ofensiva e Calendário de Registros</DialogTitle>
					<DialogDescription>
						Acompanhe seus dias consecutivos de registros nos últimos 3 meses.
					</DialogDescription>
				</DialogHeader>

				{/* Topo estilo Duolingo */}
				<div className="flex items-center justify-between gap-6 pt-1">
					<div className="flex flex-col gap-1.5">
						<span
							className={cn(
								"text-3xl font-extrabold tracking-tight",
								diasAtuais > 0 ? "text-orange-500" : "text-muted-foreground",
							)}
						>
							{diasAtuais} {diasAtuais === 1 ? "dia" : "dias"} de ofensiva
						</span>
						<span className="text-sm text-muted-foreground">
							Registre um relato ou avaliação de sentimento diariamente para
							manter sua sequência
						</span>
					</div>

					<DuotoneFlameIcon
						active={diasAtuais > 0}
						className="size-14 shrink-0 mr-8"
					/>
				</div>

				{/* Card de status do dia */}
				<div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4">
					<div
						className={cn(
							"flex size-10 shrink-0 items-center justify-center rounded-full",
							fezRegistroHoje
								? "bg-orange-500/20 text-orange-500"
								: "bg-orange-500 text-white",
						)}
					>
						{fezRegistroHoje ? (
							<DuotoneFlameIcon active className="size-5" />
						) : (
							<Clock className="size-5" />
						)}
					</div>

					<div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
						<p className="font-medium leading-snug text-foreground">
							{fezRegistroHoje
								? "Você já fez seu registro hoje e manteve sua ofensiva ativa!"
								: diasAtuais > 0
									? "Faça um registro hoje para manter sua ofensiva!"
									: "Faça um registro hoje pra começar uma nova ofensiva!"}
						</p>
						{!fezRegistroHoje && (
							<button
								type="button"
								onClick={handleComecarOfensiva}
								className="w-fit shrink-0 text-left text-xs font-extrabold tracking-wider uppercase text-orange-500 hover:text-orange-600 cursor-pointer"
							>
								COMECE UMA OFENSIVA
							</button>
						)}
					</div>
				</div>

				{/* Blocos de Maior Streak e Última Streak */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<StreakStatBlock
						label="Maior ofensiva"
						streak={streakData?.MaiorStreak}
						emptyDescription="Nenhum recorde de ofensiva registrado ainda"
					/>
					<StreakStatBlock
						label="Última ofensiva"
						streak={streakData?.UltimaStreak}
						emptyDescription="Nenhuma ofensiva anterior registrada"
					/>
				</div>

				{/* Últimos 3 meses lado a lado */}
				<div className="flex flex-col gap-3.5">
					<h3 className="text-base font-semibold text-foreground">
						Últimos 3 meses
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{ultimosTresMeses.map((mes) => (
							<div
								key={mes.chave}
								className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
							>
								<div className="mb-4 text-center">
									<span className="text-xs font-bold tracking-wider text-muted-foreground">
										{mes.titulo}
									</span>
								</div>

								<div className="mb-3 grid grid-cols-7 gap-1 text-center">
									{DIAS_SEMANA.map((dia, index) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: Dias da semana fixos
											key={index}
											className="text-xs font-bold text-muted-foreground/80"
										>
											{dia}
										</span>
									))}
								</div>

								<div className="flex flex-col gap-2">
									{mes.semanas.map((semana, weekIndex) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: Semanas fixas do mês
											key={weekIndex}
											className="grid grid-cols-7 items-center"
										>
											{semana.map((dia, dayIndex) => {
												if (!dia) {
													return (
														<div
															// biome-ignore lint/suspicious/noArrayIndexKey: Célula vazia do calendário
															key={dayIndex}
															className="h-8"
														/>
													);
												}

												const dataIso = format(dia, "yyyy-MM-dd");
												const ativo = datasSet.has(dataIso);
												const ehHoje = isSameDay(dia, hoje);

												const diaAnterior = semana[dayIndex - 1];
												const diaSeguinte = semana[dayIndex + 1];

												const conectadoEsquerda =
													ativo &&
													!!diaAnterior &&
													datasSet.has(format(diaAnterior, "yyyy-MM-dd"));
												const conectadoDireita =
													ativo &&
													!!diaSeguinte &&
													datasSet.has(format(diaSeguinte, "yyyy-MM-dd"));

												return (
													<div
														key={dataIso}
														className="relative flex h-8 items-center justify-center"
													>
														{/* Caminho com 40% da cor sólida */}
														{ativo && (
															<div
																className={cn(
																	"absolute inset-y-1.5 bg-orange-500/40",
																	conectadoEsquerda
																		? "left-0"
																		: "left-1.5 rounded-l-full",
																	conectadoDireita
																		? "right-0"
																		: "right-1.5 rounded-r-full",
																)}
															/>
														)}

														{/* Dia com cor sólida sem gradiente (verde se for hoje e concluído) */}
														<div
															className={cn(
																"relative z-10 flex size-7 items-center justify-center rounded-full text-xs font-semibold",
																ativo && ehHoje
																	? "bg-emerald-500 text-white"
																	: ativo
																		? "bg-orange-500 text-white"
																		: ehHoje
																			? "bg-muted text-foreground ring-1 ring-border font-bold"
																			: "text-muted-foreground",
															)}
														>
															{dia.getDate()}
														</div>
													</div>
												);
											})}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
