import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	nivelDisposicaoOptions,
	qualidadeSonoOptions,
	type RelatoHigieneSonoRequest,
	RelatoHigieneSonoRequestSchema,
} from "@/api/higiene-sono/schema";
import { Button } from "@/components/ui/button";

interface HigieneSonoFormProps {
	initialData?: RelatoHigieneSonoRequest;
	onSubmit: (dados: RelatoHigieneSonoRequest) => void;
	isPending?: boolean;
}

const defaults: RelatoHigieneSonoRequest = {
	dataRegistro: new Date().toLocaleDateString("en-CA"),
	horaDormir: "",
	horaAcordar: "",
	qualidadeSono: "REGULAR",
	usouCelular: false,
	tevePesadelos: false,
	comentarioSonhos: "",
	nivelDisposicao: "MEDIA",
};

const qualidadeLabels: Record<(typeof qualidadeSonoOptions)[number], string> = {
	PESSIMA: "Péssima",
	RUIM: "Ruim",
	REGULAR: "Regular",
	BOA: "Boa",
	EXCELENTE: "Excelente",
};

const disposicaoLabels: Record<
	(typeof nivelDisposicaoOptions)[number],
	string
> = {
	MUITO_BAIXA: "Muito baixa",
	BAIXA: "Baixa",
	MEDIA: "Média",
	ALTA: "Alta",
	MUITO_ALTA: "Muito alta",
};

const inputClassName =
	"w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function HigieneSonoForm({
	initialData,
	onSubmit,
	isPending = false,
}: HigieneSonoFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RelatoHigieneSonoRequest>({
		resolver: zodResolver(RelatoHigieneSonoRequestSchema),
		values: initialData ?? defaults,
	});
	const dataRegistro = initialData?.dataRegistro ?? defaults.dataRegistro;
	const [ano, mes, dia] = dataRegistro.split("-");

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
			<div className="grid gap-5 sm:grid-cols-3">
				<label className="flex flex-col gap-2 text-sm font-medium">
					Data do registro
					<input type="hidden" {...register("dataRegistro")} />
					<output className={`${inputClassName} block bg-muted`}>
						{`${dia}/${mes}/${ano}`}
					</output>
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Horário em que dormiu
					<input
						type="time"
						className={inputClassName}
						{...register("horaDormir")}
					/>
					{errors.horaDormir && (
						<span className="text-xs text-destructive">
							{errors.horaDormir.message}
						</span>
					)}
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Horário em que acordou
					<input
						type="time"
						className={inputClassName}
						{...register("horaAcordar")}
					/>
					{errors.horaAcordar && (
						<span className="text-xs text-destructive">
							{errors.horaAcordar.message}
						</span>
					)}
				</label>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<label className="flex flex-col gap-2 text-sm font-medium">
					Como foi a qualidade do sono?
					<select className={inputClassName} {...register("qualidadeSono")}>
						{qualidadeSonoOptions.map((opcao) => (
							<option key={opcao} value={opcao}>
								{qualidadeLabels[opcao]}
							</option>
						))}
					</select>
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Como estava sua disposição ao acordar?
					<select className={inputClassName} {...register("nivelDisposicao")}>
						{nivelDisposicaoOptions.map((opcao) => (
							<option key={opcao} value={opcao}>
								{disposicaoLabels[opcao]}
							</option>
						))}
					</select>
				</label>
			</div>

			<fieldset className="flex flex-wrap gap-x-8 gap-y-3">
				<legend className="mb-3 text-sm font-medium">Hábitos e sonhos</legend>
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						className="size-4 accent-primary"
						{...register("usouCelular")}
					/>
					Usei celular antes de dormir
				</label>
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						className="size-4 accent-primary"
						{...register("tevePesadelos")}
					/>
					Tive pesadelos
				</label>
			</fieldset>

			<label className="flex flex-col gap-2 text-sm font-medium">
				Comentário sobre os sonhos
				<textarea
					rows={4}
					maxLength={1000}
					placeholder="Anote algo que queira lembrar..."
					className={`${inputClassName} resize-y`}
					{...register("comentarioSonhos")}
				/>
				<span className="text-xs font-normal text-muted-foreground">
					Até 1000 caracteres
				</span>
				{errors.comentarioSonhos && (
					<span className="text-xs text-destructive">
						{errors.comentarioSonhos.message}
					</span>
				)}
			</label>

			<div className="flex flex-wrap justify-end gap-3">
				<Button type="submit" disabled={isPending}>
					{isPending ? "Salvando..." : "Salvar registro"}
				</Button>
			</div>
		</form>
	);
}
