import { z } from "zod";

export const DiaSemanaLembreteSchema = z.enum([
	"SEGUNDA",
	"TERCA",
	"QUARTA",
	"QUINTA",
	"SEXTA",
	"SABADO",
	"DOMINGO",
]);

export const TipoLembreteSchema = z.enum([
	"TRINTA_MINUTOS_ANTES",
	"QUINZE_MINUTOS_ANTES",
	"HORARIO",
]);

export const LembreteSchema = z.object({
	id: z.number().nullable().optional(),
	hora: z.string().nullable().optional(),
	ultimaDataEnvio: z.string().nullable().optional(),
	diaSemana: DiaSemanaLembreteSchema.nullable().optional(),
	tipoLembrete: TipoLembreteSchema.nullable().optional(),
	atividadeObrigatoriaTitulo: z.string().nullable().optional(),
});

export const LembreteDtoSchema = z.object({
	id: z.number().optional(),
	tipoLembreteList: z.array(TipoLembreteSchema),
});

export type DiaSemanaLembrete = z.infer<typeof DiaSemanaLembreteSchema>;
export type TipoLembrete = z.infer<typeof TipoLembreteSchema>;
export type Lembrete = z.infer<typeof LembreteSchema>;
export type LembreteDto = z.infer<typeof LembreteDtoSchema>;
