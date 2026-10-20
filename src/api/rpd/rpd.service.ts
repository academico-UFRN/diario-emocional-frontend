import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type { RpdRequest, RpdResponse } from "./schema";

const endpoint = (usuarioId: number) => `/api/rpd/${usuarioId}`;

export const listarRegistrosRpd = async (
	usuarioId: number,
): Promise<RpdResponse[]> => {
	const response: AxiosResponse<RpdResponse[]> = await api.get(
		endpoint(usuarioId),
	);
	return response.data;
};

export const buscarRegistroRpd = async (
	usuarioId: number,
	id: number,
): Promise<RpdResponse> => {
	const response: AxiosResponse<RpdResponse> = await api.get(
		`${endpoint(usuarioId)}/${id}`,
	);
	return response.data;
};

export const criarRegistroRpd = async (
	usuarioId: number,
	dados: RpdRequest,
): Promise<RpdResponse> => {
	const response: AxiosResponse<RpdResponse> = await api.post(
		endpoint(usuarioId),
		dados,
	);
	return response.data;
};

export const editarRegistroRpd = async (
	usuarioId: number,
	id: number,
	dados: RpdRequest,
): Promise<RpdResponse> => {
	const response: AxiosResponse<RpdResponse> = await api.put(
		`${endpoint(usuarioId)}/${id}`,
		dados,
	);
	return response.data;
};

export const deletarRegistroRpd = async (
	usuarioId: number,
	id: number,
): Promise<void> => {
	await api.delete(`${endpoint(usuarioId)}/${id}`);
};
