import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type { SolicitacaoSaudeMental } from "./schema";

export const CriarSolicitacaoSaudeMental = async (
	usuarioId: number,
): Promise<SolicitacaoSaudeMental> => {
	const response: AxiosResponse<SolicitacaoSaudeMental> = await api.post(
		`/sugestao-saude-mental/${usuarioId}`,
	);

	return response.data;
};

export const ListarSolicitacoesSaudeMental = async (
	usuarioId: number,
): Promise<SolicitacaoSaudeMental[]> => {
	const response: AxiosResponse<SolicitacaoSaudeMental[]> = await api.get(
		`/sugestao-saude-mental/buscarVarios/${usuarioId}`,
	);

	return response.data;
};

export const BuscarSolicitacaoSaudeMental = async (
	usuarioId: number,
	solicitacaoId: number,
): Promise<SolicitacaoSaudeMental> => {
	const response: AxiosResponse<SolicitacaoSaudeMental> = await api.get(
		`/sugestao-saude-mental/buscarEspecifico/${usuarioId}/${solicitacaoId}`,
	);

	return response.data;
};