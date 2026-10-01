import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type { RelatoHigieneSono, RelatoHigieneSonoRequest } from "./schema";

const endpoint = (usuarioId: number) => `/api/higiene-sono/${usuarioId}`;

export const listarRelatosHigieneSono = async (
	usuarioId: number,
): Promise<RelatoHigieneSono[]> => {
	const response: AxiosResponse<RelatoHigieneSono[]> = await api.get(
		endpoint(usuarioId),
	);
	return response.data;
};

export const buscarRelatoHigieneSono = async (
	usuarioId: number,
	id: number,
): Promise<RelatoHigieneSono> => {
	const response: AxiosResponse<RelatoHigieneSono> = await api.get(
		`${endpoint(usuarioId)}/${id}`,
	);
	return response.data;
};

export const criarRelatoHigieneSono = async (
	usuarioId: number,
	dados: RelatoHigieneSonoRequest,
): Promise<RelatoHigieneSono> => {
	const response: AxiosResponse<RelatoHigieneSono> = await api.post(
		endpoint(usuarioId),
		dados,
	);
	return response.data;
};

export const editarRelatoHigieneSono = async (
	usuarioId: number,
	id: number,
	dados: RelatoHigieneSonoRequest,
): Promise<RelatoHigieneSono> => {
	const response: AxiosResponse<RelatoHigieneSono> = await api.put(
		`${endpoint(usuarioId)}/${id}`,
		dados,
	);
	return response.data;
};

export const deletarRelatoHigieneSono = async (
	usuarioId: number,
	id: number,
): Promise<void> => {
	await api.delete(`${endpoint(usuarioId)}/${id}`);
};
