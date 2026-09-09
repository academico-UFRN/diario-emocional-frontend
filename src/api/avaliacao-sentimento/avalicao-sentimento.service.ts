import { api } from "../axios";
import type {
  AvaliacaoSentimento,
  AvaliacaoSentimentoInput,
} from "./schema";

// Interfaces para os parâmetros das mutações
export interface CriarAvaliacaoParams {
  usuarioId: number;
  dados: AvaliacaoSentimentoInput;
}

export interface EditarAvaliacaoParams {
  usuarioId: number;
  dataRegistro: string;
  dados: AvaliacaoSentimentoInput;
}

export interface DeletarAvaliacaoParams {
  usuarioId: number;
  dataRegistro: string;
}

// POST /avaliar-sentimentos/{usuarioId}
export const criarAvaliacaoSentimento = async ({
  usuarioId,
  dados,
}: CriarAvaliacaoParams): Promise<AvaliacaoSentimento> => {
  const { data } = await api.post<AvaliacaoSentimento>(
    `/avaliar-sentimentos/${usuarioId}`,
    dados
  );
  return data;
};

// GET /avaliar-sentimentos/{usuarioId}
export const listarAvaliacoesSentimento = async (
  usuarioId: number
): Promise<AvaliacaoSentimento[]> => {
  const { data } = await api.get<AvaliacaoSentimento[]>(
    `/avaliar-sentimentos/${usuarioId}`
  );
  return data;
};

// GET /avaliar-sentimentos/{usuarioId}/{dataRegistro}
export const obterAvaliacaoSentimento = async (
  usuarioId: number,
  dataRegistro: string
): Promise<AvaliacaoSentimento> => {
  const { data } = await api.get<AvaliacaoSentimento>(
    `/avaliar-sentimentos/${usuarioId}/${dataRegistro}`
  );
  return data;
};

// PUT /avaliar-sentimentos/{usuarioId}/{dataRegistro}
export const editarAvaliacaoSentimento = async ({
  usuarioId,
  dataRegistro,
  dados,
}: EditarAvaliacaoParams): Promise<AvaliacaoSentimento> => {
  const { data } = await api.put<AvaliacaoSentimento>(
    `/avaliar-sentimentos/${usuarioId}/${dataRegistro}`,
    dados
  );
  return data;
};

// DELETE /avaliar-sentimentos/{usuarioId}/{dataRegistro}
export const deletarAvaliacaoSentimento = async ({
  usuarioId,
  dataRegistro,
}: DeletarAvaliacaoParams): Promise<void> => {
  await api.delete(`/avaliar-sentimentos/${usuarioId}/${dataRegistro}`);
};