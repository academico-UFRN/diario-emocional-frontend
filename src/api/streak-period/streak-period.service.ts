import { api } from "../axios";
import type { StreakPeriod } from "./schema";

export const buscarStreakPeriod = async (
	usuarioId = 1,
): Promise<StreakPeriod> => {
	const { data } = await api.get<StreakPeriod>(`/streak-period/${usuarioId}`);
	return data;
};
