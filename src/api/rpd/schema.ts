import { z } from "zod";

const textoNaoVazio = z.string().refine((valor) => valor.trim().length > 0, {
	message: "Este campo é obrigatório.",
});

export const RpdRequestSchema = z.object({
	intensidadeCrise: z
		.number()
		.int("Informe um número inteiro.")
		.min(1, "A intensidade mínima é 1.")
		.max(10, "A intensidade máxima é 10."),
	emocoesPrincipais: z.array(textoNaoVazio).optional(),
	gatilhoSituacao: z.string().optional(),
	pensamentoAutomatico: textoNaoVazio,
	distorcoesCognitivas: z.array(textoNaoVazio).optional(),
	evidenciasContraArgumento: z.string().optional(),
	pensamentoAlternativo: z.string().optional(),
	intensidadeReavaliada: z
		.number()
		.int("Informe um número inteiro.")
		.min(1, "A intensidade mínima é 1.")
		.max(10, "A intensidade máxima é 10.")
		.optional(),
});

export type RpdRequest = z.infer<typeof RpdRequestSchema>;

export interface RpdResponse {
	id: number;
	dataHoraRegistro: string;
	intensidadeCrise: number;
	emocoesPrincipais: string[];
	gatilhoSituacao: string | null;
	pensamentoAutomatico: string;
	distorcoesCognitivas: string[];
	evidenciasContraArgumento: string | null;
	pensamentoAlternativo: string | null;
	intensidadeReavaliada: number | null;
}
