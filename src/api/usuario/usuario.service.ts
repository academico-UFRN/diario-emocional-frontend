import { api } from "../axios";

export interface UsuarioLoginRequest {
	nome: string;
	senha: string;
}

export interface UsuarioCriarRequest {
	nome: string;
	senha: string;
}

export interface UsuarioEditarRequest {
	nome?: string;
	senha?: string;
}

export async function loginUsuario(dados: UsuarioLoginRequest): Promise<number> {
	const { data } = await api.post<number>("/usuario/login", dados);

	return data;
}

export async function criarUsuario(dados: UsuarioCriarRequest): Promise<number> {
	const { data } = await api.post<number>("/usuario/criar", dados);

	return data;
}

export async function editarUsuario(
	usuarioId: number,
	dados: UsuarioEditarRequest,
): Promise<void> {
	await api.put(`/usuario/editar/${usuarioId}`, dados);
}

export async function deletarUsuario(usuarioId: number): Promise<void> {
	await api.delete(`/usuario/deletar/${usuarioId}`);
}