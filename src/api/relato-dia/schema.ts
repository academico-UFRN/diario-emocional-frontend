import { z } from "zod";

export const RelatoDiaSchema = z.object({
  dataRegistro: z.string(),
  titulo: z.string(),
  conteudoHtml: z.string(),
  favorito: z.boolean(),
});

export const RelatoDiaEditarDtoSchema = z.object({
  titulo: z.string(),
  conteudoHtml: z.string(),
  favorito: z.boolean(),
});

export type RelatoDia = z.infer<typeof RelatoDiaSchema>;

export type RelatoDiaEditarDto = z.infer<
  typeof RelatoDiaEditarDtoSchema
>;

export const RelatoDiaCriarRequestSchema = z.object({
  dataRegistro: z.string(),
  titulo: z.string().min(1, "O título é obrigatório"),
  conteudoHtml: z.string().min(1, "O relato é obrigatório"),
  favorito: z.boolean(),
});

export type RelatoDiaCriarRequest = z.infer<
  typeof RelatoDiaCriarRequestSchema
>;