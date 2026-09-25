import { api } from "../axios";
import type { ChatRequest, ChatResponse, ChatResumoResponse } from "./schema";

export interface CriarChatParams {
    usuarioId: number;
    dados: ChatRequest;
}

export interface EnviarMensagemChatParams {
    usuarioId: number;
    chatId: string;
    dados: ChatRequest;
}

export interface ListarChatsParams {
    usuarioId: number;
}

export interface DeletarChatParams {
    chatId: string;
}


export const listarChats = async ({ usuarioId }: ListarChatsParams): Promise<ChatResumoResponse[]> => {
    const { data } = await api.get<ChatResumoResponse[]>(`/chat/ai/${usuarioId}`);
    return data;
}

export const obterChat = async ({ chatId }: { chatId: string }): Promise<ChatResponse> => {
    const { data } = await api.get<ChatResponse>(`/chat/ai/chat/${chatId}`);
    return data;
}

export const criarChat = async ({ usuarioId, dados }: CriarChatParams): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>(`/chat/ai/criar/${usuarioId}`, dados);

    return data;
};

export const enviarMensagemChat = async (
    { usuarioId, chatId, dados }: EnviarMensagemChatParams
): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>(`/chat/ai/${chatId}/${usuarioId}`, dados);
    return data;
};

export const deletarChat = async ({ chatId }: DeletarChatParams): Promise<void> => {
    await api.delete(`/chat/ai/${chatId}`);
}