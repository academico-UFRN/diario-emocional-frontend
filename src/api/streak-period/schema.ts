import { z } from "zod";

export const StreakPeriodItemSchema = z.object({
	id: z.string(),
	dataInicio: z.string(),
	dataFinal: z.string(),
	qtdDias: z.number(),
});

export const StreakPeriodSchema = z.object({
	MaiorStreak: StreakPeriodItemSchema.nullable().optional(),
	UltimaStreak: StreakPeriodItemSchema.nullable().optional(),
	datas: z.array(z.string()),
});

export type StreakPeriodItem = z.infer<typeof StreakPeriodItemSchema>;
export type StreakPeriod = z.infer<typeof StreakPeriodSchema>;
