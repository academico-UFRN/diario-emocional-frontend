import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { RpdRequest } from "@/api/rpd/schema";
import { RpdRequestSchema } from "@/api/rpd/schema";
import { Button } from "@/components/ui/button";

interface RpdFormProps {
	initialData?: RpdRequest;
	onSubmit: (dados: RpdRequest) => void;
	isPending?: boolean;
}

const defaults: RpdRequest = {
	intensidadeCrise: 5,
	emocoesPrincipais: [],
	gatilhoSituacao: "",
	pensamentoAutomatico: "",
	distorcoesCognitivas: [],
	evidenciasContraArgumento: "",
	pensamentoAlternativo: "",
	intensidadeReavaliada: undefined,
};

const inputClassName =
	"w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function RpdForm({
	initialData,
	onSubmit,
	isPending = false,
}: RpdFormProps) {
	const [emocao, setEmocao] = useState("");
	const [distorcao, setDistorcao] = useState("");
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<RpdRequest>({
		resolver: zodResolver(RpdRequestSchema),
		defaultValues: initialData ?? defaults,
	});
	const emocoes = watch("emocoesPrincipais") ?? [];
	const distorcoes = watch("distorcoesCognitivas") ?? [];

	function adicionarItem(
		valor: string,
		itens: string[],
		campo: "emocoesPrincipais" | "distorcoesCognitivas",
		limpar: (valor: string) => void,
	) {
		const novoItem = valor.trim();
		if (!novoItem) return;
		if (
			itens.some(
				(item) => item.toLocaleLowerCase() === novoItem.toLocaleLowerCase(),
			)
		) {
			limpar("");
			return;
		}
		setValue(campo, [...itens, novoItem], {
			shouldDirty: true,
			shouldValidate: true,
		});
		limpar("");
	}

	function removerItem(
		item: string,
		itens: string[],
		campo: "emocoesPrincipais" | "distorcoesCognitivas",
	) {
		setValue(
			campo,
			itens.filter((itemAtual) => itemAtual !== item),
			{ shouldDirty: true, shouldValidate: true },
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			<div className="grid gap-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2 text-sm font-medium">
					Intensidade da crise (1 a 10)
					<input
						type="number"
						min={1}
						max={10}
						step={1}
						className={inputClassName}
						{...register("intensidadeCrise", { valueAsNumber: true })}
					/>
					{errors.intensidadeCrise && (
						<span className="text-xs text-destructive">
							{errors.intensidadeCrise.message}
						</span>
					)}
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Situação ou gatilho
					<textarea
						rows={2}
						className={`${inputClassName} resize-y`}
						placeholder="O que estava acontecendo?"
						{...register("gatilhoSituacao")}
					/>
				</label>
			</div>

			<fieldset className="flex flex-col gap-3">
				<legend className="text-sm font-medium">Emoções principais</legend>
				<div className="flex flex-wrap gap-2">
					{Array.from(new Set(emocoes)).map((item) => (
						<span
							key={item}
							className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm"
						>
							{item}
							<button
								type="button"
								aria-label={`Remover emoção ${item}`}
								className="font-semibold text-muted-foreground hover:text-foreground"
								onClick={() => removerItem(item, emocoes, "emocoesPrincipais")}
							>
								×
							</button>
						</span>
					))}
				</div>
				<div className="flex flex-col gap-2 sm:flex-row">
					<input
						value={emocao}
						onChange={(event) => setEmocao(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								adicionarItem(emocao, emocoes, "emocoesPrincipais", setEmocao);
							}
						}}
						aria-label="Nova emoção"
						placeholder="Ex.: ansiedade"
						className={inputClassName}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							adicionarItem(emocao, emocoes, "emocoesPrincipais", setEmocao)
						}
					>
						Adicionar emoção
					</Button>
				</div>
			</fieldset>

			<label className="flex flex-col gap-2 text-sm font-medium">
				Pensamento automático
				<textarea
					rows={3}
					className={`${inputClassName} resize-y`}
					placeholder="O que passou pela sua mente nessa situação?"
					{...register("pensamentoAutomatico")}
				/>
				{errors.pensamentoAutomatico && (
					<span className="text-xs text-destructive">
						{errors.pensamentoAutomatico.message}
					</span>
				)}
			</label>

			<fieldset className="flex flex-col gap-3">
				<legend className="text-sm font-medium">Distorções cognitivas</legend>
				<div className="flex flex-wrap gap-2">
					{Array.from(new Set(distorcoes)).map((item) => (
						<span
							key={item}
							className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm"
						>
							{item}
							<button
								type="button"
								aria-label={`Remover distorção ${item}`}
								className="font-semibold text-muted-foreground hover:text-foreground"
								onClick={() =>
									removerItem(item, distorcoes, "distorcoesCognitivas")
								}
							>
								×
							</button>
						</span>
					))}
				</div>
				<div className="flex flex-col gap-2 sm:flex-row">
					<input
						value={distorcao}
						onChange={(event) => setDistorcao(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								adicionarItem(
									distorcao,
									distorcoes,
									"distorcoesCognitivas",
									setDistorcao,
								);
							}
						}}
						aria-label="Nova distorção cognitiva"
						placeholder="Ex.: pensamento tudo ou nada"
						className={inputClassName}
					/>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							adicionarItem(
								distorcao,
								distorcoes,
								"distorcoesCognitivas",
								setDistorcao,
							)
						}
					>
						Adicionar distorção
					</Button>
				</div>
			</fieldset>

			<label className="flex flex-col gap-2 text-sm font-medium">
				Evidências e contra-argumentos
				<textarea
					rows={3}
					className={`${inputClassName} resize-y`}
					placeholder="Quais fatos apoiam ou contradizem esse pensamento?"
					{...register("evidenciasContraArgumento")}
				/>
			</label>

			<div className="grid gap-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2 text-sm font-medium">
					Pensamento alternativo
					<textarea
						rows={3}
						className={`${inputClassName} resize-y`}
						placeholder="Há outra forma de interpretar a situação?"
						{...register("pensamentoAlternativo")}
					/>
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Intensidade reavaliada (opcional, 1 a 10)
					<input
						type="number"
						min={1}
						max={10}
						step={1}
						className={inputClassName}
						{...register("intensidadeReavaliada", {
							setValueAs: (valor: string) =>
								valor === "" ? undefined : Number(valor),
						})}
					/>
					{errors.intensidadeReavaliada && (
						<span className="text-xs text-destructive">
							{errors.intensidadeReavaliada.message}
						</span>
					)}
				</label>
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={isPending}>
					{isPending ? "Salvando..." : "Salvar registro"}
				</Button>
			</div>
		</form>
	);
}
