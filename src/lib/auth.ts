const USUARIO_ID_KEY = "diario-emocional-usuario-id";

export function obterUsuarioId(): number {
	const usuarioId = Number(localStorage.getItem(USUARIO_ID_KEY));

	if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
		throw new Error("Nenhum usuário está autenticado.");
	}

	return usuarioId;
}

export function obterUsuarioIdSalvo(): number | null {
	try {
		return obterUsuarioId();
	} catch {
		return null;
	}
}

export function salvarUsuarioId(usuarioId: number): void {
	if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
		throw new Error("O servidor retornou um ID de usuário inválido.");
	}

	localStorage.setItem(USUARIO_ID_KEY, String(usuarioId));
}

export function encerrarSessao(): void {
	localStorage.removeItem(USUARIO_ID_KEY);
}