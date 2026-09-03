import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type {
	AvaliacaoSentimento,
	AvaliacaoSentimentoCriar,
	AvaliacaoSentimentoEditar,
} from "./schema";

export const CriarAvaliacaoSentimento = async ({
	usuarioId,
	...props
}: AvaliacaoSentimentoCriar): Promise<AvaliacaoSentimento> => {
	const response: AxiosResponse<AvaliacaoSentimento> = await api.post(
		`/avaliar-sentimentos/${usuarioId}`,
		props,
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

export const EditarAvaliacaoSentimento = async ({
	usuarioId,
	dataRegistro,
	...props
}: AvaliacaoSentimentoEditar): Promise<AvaliacaoSentimento> => {
	const response: AxiosResponse<AvaliacaoSentimento> = await api.put(
		`/avaliar-sentimentos/${usuarioId}/${dataRegistro}`,
		props,
	);

	return response.data;
};

export const DeletarAvaliacaoSentimento = async (
	dataRegistro: string,
	usuarioId: number,
): Promise<void> => {
	await api.delete(`/avaliar-sentimentos/${usuarioId}/${dataRegistro}`);
};
