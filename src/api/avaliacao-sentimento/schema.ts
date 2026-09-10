import { z } from "zod";

// Schemas Base
export const UsuarioSchema = z.object({
  id: z.number(),
});

export const SentimentoSchema = z.object({
  sentimento: z.string().min(1, "O sentimento não pode ser vazio"),
  intensidade: z.number().min(1).max(10, "A intensidade deve ser de 1 a 10"),
});

// Schema da Avaliação Completa - AvaliacaoSentimentoResponse
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
  // textoLivre: z.string().max(250, "O texto livre deve ter no máximo 250 caracteres").optional(), // Para demonstrar erro do backend, descomente essa linha e comente a linha acima
});

// Schemma de Input para criação/edição
export const AvaliacaoSentimentoInputSchema = AvaliacaoSentimentoSchema.omit({
  dataRegistro: true,
  usuario: true,
});

// Inferência de Tipos TypeScript - Para usar em tipagens de funções
export type Usuario = z.infer<typeof UsuarioSchema>;
export type Sentimento = z.infer<typeof SentimentoSchema>;
export type AvaliacaoSentimento = z.infer<typeof AvaliacaoSentimentoSchema>;
export type AvaliacaoSentimentoInput = z.infer<typeof AvaliacaoSentimentoInputSchema>;