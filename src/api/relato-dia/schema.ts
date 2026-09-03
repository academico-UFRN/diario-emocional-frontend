import { z } from "zod";

export const UsuarioSchema = z.object({
	id: z.number(),
});

export const RelatoDiaSchema = z.object({
	dataRegistro: z.string(),
    titulo: z.string(),
    conteudoHtml: z.string(),
    isFavorito: z.boolean()
});
export const RelatoDiaRequest = typeof RelatoDiaSchema;

export type Usuario = z.infer<typeof UsuarioSchema>;
export type RelatoDia = z.infer<typeof RelatoDiaSchema>;