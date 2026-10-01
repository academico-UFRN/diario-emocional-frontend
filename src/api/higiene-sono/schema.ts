import { z } from "zod";

export const qualidadeSonoOptions = [
	"PESSIMA",
	"RUIM",
	"REGULAR",
	"BOA",
	"EXCELENTE",
] as const;

export const nivelDisposicaoOptions = [
	"MUITO_BAIXA",
	"BAIXA",
	"MEDIA",
	"ALTA",
	"MUITO_ALTA",
] as const;

export const RelatoHigieneSonoRequestSchema = z
	.object({
		dataRegistro: z.string().min(1, "A data é obrigatória"),
		horaDormir: z.string().min(1, "Informe o horário em que foi dormir"),
		horaAcordar: z.string().min(1, "Informe o horário em que acordou"),
		qualidadeSono: z.enum(qualidadeSonoOptions),
		usouCelular: z.boolean(),
		tevePesadelos: z.boolean(),
		comentarioSonhos: z.string().max(1000, "Use até 1000 caracteres"),
		nivelDisposicao: z.enum(nivelDisposicaoOptions),
	})
	.refine((dados) => dados.horaDormir !== dados.horaAcordar, {
		message: "Os horários de dormir e acordar não podem ser iguais",
		path: ["horaAcordar"],
	});

export const RelatoHigieneSonoSchema = RelatoHigieneSonoRequestSchema.extend({
	id: z.number(),
	duracaoSonoMinutos: z.number(),
});

export type RelatoHigieneSonoRequest = z.infer<
	typeof RelatoHigieneSonoRequestSchema
>;
export type RelatoHigieneSono = z.infer<typeof RelatoHigieneSonoSchema>;
