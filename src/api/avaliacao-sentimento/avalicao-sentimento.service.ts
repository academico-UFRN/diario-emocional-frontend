import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type { AvaliacaoSentimento, AvaliacaoSentimentoRequest } from "./schema";

export const CriarAvaliacaoSentimento = async (
	novaAvaliacao: AvaliacaoSentimentoRequest,
): Promise<AvaliacaoSentimento> => {
	const response: AxiosResponse<AvaliacaoSentimento> = await api.post(
		"/avaliar-sentimentos",
		novaAvaliacao,
	);

	return response.data;
};

export const ListarAvaliacoesSentimento = async (
	usuarioId: number,
): Promise<AvaliacaoSentimento[]> => {
	const response: AxiosResponse<AvaliacaoSentimento[]> = await api.get(
		`/avaliar-sentimentos/${usuarioId}`,
	);

	return response.data;
};

export const EditarAvaliacaoSentimento = async (
	dataRegistro: string,
	usuarioId: number,
	editadaAvaliacao: AvaliacaoSentimentoRequest,
): Promise<AvaliacaoSentimento> => {
	const response: AxiosResponse<AvaliacaoSentimento> = await api.put(
		`/avaliar-sentimentos/${usuarioId}/${dataRegistro}`,
		editadaAvaliacao,
	);

	return response.data;
};

export const DeletarAvaliacaoSentimento = async (
	dataRegistro: string,
	usuarioId: number,
): Promise<void> => {
	await api.delete(`/avaliar-sentimentos/${usuarioId}/${dataRegistro}`);
};
