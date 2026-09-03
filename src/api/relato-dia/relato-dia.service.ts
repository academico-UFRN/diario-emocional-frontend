import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type { RelatoDiaSchema, RelatoDiaRequest, RelatoDia } from "./schema";

export const CriarRelatoDia = async (
	novoRelato: typeof RelatoDiaRequest,
): Promise<RelatoDia> => {
	const response: AxiosResponse<RelatoDia> = await api.post(
		"/relato/criar",
		novoRelato,
	);

	return response.data;
};

export const ListarRelatosDia = async (
	usuarioId: number,
): Promise<RelatoDia[]> => {
	const response: AxiosResponse<RelatoDia[]> = await api.get(
		`/relato/buscarVarios/${usuarioId}`,
	);

	return response.data;
};

export const EditarRelatoDia = async (
	dataRegistro: string,
	usuarioId: number,
	editadoRelato: typeof RelatoDiaRequest,
): Promise<RelatoDia> => {
	const response: AxiosResponse<RelatoDia> = await api.put(
		`/relato/editar/${usuarioId}/${dataRegistro}`,
		editadoRelato,
	);

	return response.data;
};

export const DeletarRelatoDia = async (
	dataRegistro: string,
	usuarioId: number,
): Promise<void> => {
	await api.delete(`/relato/deletar/${usuarioId}/${dataRegistro}`);
};