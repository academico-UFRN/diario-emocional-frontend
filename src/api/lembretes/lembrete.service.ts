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

	console.log("RESPONSE /lembrete/nao-enviados:", response);
	console.log("DATA /lembrete/nao-enviados:", response.data);

	if (response.status === 204 || response.data == null) {
		return null;
	}

	const payload = extrairLembrete(response.data);
	console.log("PAYLOAD EXTRAÍDO:", payload);

	if (!payload) {
		return null;
	}

	const parsed = LembreteSchema.safeParse(payload);

	if (!parsed.success) {
		console.warn("Lembrete em formato inesperado:", response.data);
		return null;
	}

	if (!parsed.data?.tipoLembrete || !parsed.data.hora) {
		console.warn("Lembrete inválido para notificação, ignorando:", parsed.data);
		return null;
	}

	return parsed.data;
};
