import { z } from "zod";

export const UsuarioSchema = z.object({
	id: z.number(),
});

export const SentimentoSchema = z.object({
	sentimento: z.string().min(1, "O sentimento não pode ser vazio"),
	intensidade: z.number().min(1).max(10),
});

export const AvaliacaoSentimentoSchema = z.object({
	dataRegistro: z.string(),
	avaliacaoDia: z.number().min(1).max(5),
	sentimentos: z.array(SentimentoSchema),
	gatilhos: z.array(z.string()),
	usuario: UsuarioSchema,
	textoLivre: z.string().optional(),
});

export const AvaliacaoSentimentoRequest = AvaliacaoSentimentoSchema.omit({
	usuario: true,
	dataRegistro: true,
});

export type AvaliacaoSentimentoRequest = z.infer<
	typeof AvaliacaoSentimentoRequest
>;
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Sentimento = z.infer<typeof SentimentoSchema>;
export type AvaliacaoSentimento = z.infer<typeof AvaliacaoSentimentoSchema>;
