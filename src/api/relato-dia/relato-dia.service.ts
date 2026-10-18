import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type {
	RelatoDia,
	RelatoDiaCriarRequest,
	RelatoDiaEditarDto,
} from "./schema";

export const CriarRelatoDia = async (
	novoRelato: RelatoDiaCriarRequest,
	usuarioId: number
): Promise<RelatoDia> => {
	const response: AxiosResponse<RelatoDia> = await api.post(
		`/relato/criar/${usuarioId}`,
		novoRelato,
	);

	return response.data;
};

export const BuscarRelatoDia = async (
	dataRegistro: string,
	usuarioId: number,
): Promise<RelatoDia> => {
	const response: AxiosResponse<RelatoDia> = await api.get(
		`/relato/buscarEspecifico/${usuarioId}/${dataRegistro}`,
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
	editadoRelato: RelatoDiaEditarDto,
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

export const BuscarSugestaoRelatoDia = async (
	usuarioId: number,
): Promise<string> => {
	const response = await api.get<string>(`/relato/IA-sugestao/${usuarioId}`);

	if (response.status !== 200) {
		throw new Error(`Resposta da sugestão não foi OK (HTTP ${response.status}).`);
	}

	return response.data;
}