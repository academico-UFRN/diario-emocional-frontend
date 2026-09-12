import { z } from "zod";

export const DiaSemanaSchema = z.enum([
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
]);

export const CronogramaObrigatorioSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().min(1, "O título é obrigatório"),
  subtitulo: z.string().optional().nullable(),
  horaInicio: z.string().min(1, "A hora de início é obrigatória"),
  horaFim: z.string().min(1, "A hora de fim é obrigatória"),
  diasDaSemana: z
    .array(DiaSemanaSchema)
    .min(1, "Selecione pelo menos um dia da semana"),
  usuarioId: z.number(),
  dataCriacao: z.string().optional(),
  dataAtualizacao: z.string().optional(),
  ativo: z.boolean().default(true),
});

export const CronogramaObrigatorioInputSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  subtitulo: z.string().optional().nullable(),
  horaInicio: z.string().min(1, "A hora de início é obrigatória"),
  horaFim: z.string().min(1, "A hora de fim é obrigatória"),
  diasDaSemana: z
    .array(DiaSemanaSchema)
    .min(1, "Selecione pelo menos um dia da semana"),
  ativo: z.boolean(),
});

export type DiaSemana = z.infer<typeof DiaSemanaSchema>;
export type CronogramaObrigatorio = z.infer<typeof CronogramaObrigatorioSchema>;
export type CronogramaObrigatorioInput = {
  titulo: string;
  subtitulo?: string | null;
  horaInicio: string;
  horaFim: string;
  diasDaSemana: DiaSemana[];
  ativo: boolean;
};
