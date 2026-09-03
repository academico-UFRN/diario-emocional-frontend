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
	avaliacaoDia: z
		.number()
		.min(1, "A avaliação do dia deve ser entre 1 e 5")
		.max(5, "A avaliação do dia deve ser entre 1 e 5"),
	sentimentos: z
		.array(SentimentoSchema)
		.min(1, "Selecione pelo menos um sentimento"),
	gatilhos: z.array(z.string()).optional(),
	usuario: UsuarioSchema,
	textoLivre: z.string().optional(),
});

export const AvaliacaoSentimentoSchemaCriar = z.object({
	avaliacaoDia: z
		.number()
		.min(1, "A avaliação do dia deve ser entre 1 e 5")
		.max(5, "A avaliação do dia deve ser entre 1 e 5"),
	sentimentos: z
		.array(SentimentoSchema)
		.min(1, "Selecione pelo menos um sentimento"),
	gatilhos: z.array(z.string()).optional(),
	usuarioId: z.number("O ID do usuário deve ser um número"),
	textoLivre: z.string().optional(),
});

export const AvaliacaoSentimentoSchemaEditar = z.object({
	dataRegistro: z.string(),
	avaliacaoDia: z
		.number()
		.min(1, "A avaliação do dia deve ser entre 1 e 5")
		.max(5, "A avaliação do dia deve ser entre 1 e 5"),
	sentimentos: z
		.array(SentimentoSchema)
		.min(1, "Selecione pelo menos um sentimento"),
	gatilhos: z.array(z.string()).optional(),
	usuarioId: z.number("O ID do usuário deve ser um número"),
	textoLivre: z.string().optional(),
});

export const AvaliacaoSentimentoCriar = AvaliacaoSentimentoSchemaCriar;
export const AvaliacaoSentimentoEditar = AvaliacaoSentimentoSchemaEditar;

export type AvaliacaoSentimentoEditar = z.infer<
	typeof AvaliacaoSentimentoEditar
>;
export type AvaliacaoSentimentoCriar = z.infer<typeof AvaliacaoSentimentoCriar>;

export type Usuario = z.infer<typeof UsuarioSchema>;
export type Sentimento = z.infer<typeof SentimentoSchema>;
export type AvaliacaoSentimento = z.infer<typeof AvaliacaoSentimentoSchema>;
