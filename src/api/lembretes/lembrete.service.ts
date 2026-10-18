import { api } from "../axios";
import { type Lembrete, LembreteSchema } from "./schema";

function extrairLembrete(payload: unknown): unknown {
	if (Array.isArray(payload)) {
		return payload[0] ?? null;
	}

	if (payload && typeof payload === "object") {
		const record = payload as Record<string, unknown>;

		if (record.data !== undefined) return extrairLembrete(record.data);
		if (record.lembrete !== undefined) return extrairLembrete(record.lembrete);
		if (record.result !== undefined) return extrairLembrete(record.result);
		if (record.item !== undefined) return extrairLembrete(record.item);
	}

	return payload;
}

export const buscarLembreteNaoEnviado = async (): Promise<Lembrete | null> => {
	const response = await api.get<unknown>("/lembrete/nao-enviados");

	if (response.status === 204 || response.data == null) {
		return null;
	}

	const payload = extrairLembrete(response.data);

	if (!payload) {
		return null;
	}

	const parsed = LembreteSchema.safeParse(payload);

	if (!parsed.success) {
		return null;
	}

	if (!parsed.data?.tipoLembrete || !parsed.data.hora) {
		return null;
	}

	return parsed.data;
};
