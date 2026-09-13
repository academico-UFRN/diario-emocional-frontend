import type { AxiosResponse } from "axios";
import { api } from "../axios";
import type {
  CronogramaObrigatorio,
  CronogramaObrigatorioInput,
} from "./schema";

export interface CriarCronogramaObrigatorioParams {
  usuarioId: number;
  dados: CronogramaObrigatorioInput;
}

export interface EditarCronogramaObrigatorioParams {
  usuarioId: number;
  id: number;
  dados: CronogramaObrigatorioInput;
}

export interface DeletarCronogramaObrigatorioParams {
  usuarioId: number;
  id: number;
}

export const criarCronogramaObrigatorio = async ({
  usuarioId,
  dados,
}: CriarCronogramaObrigatorioParams): Promise<CronogramaObrigatorio> => {
  const response: AxiosResponse<CronogramaObrigatorio> = await api.post(
    `/api/atividades-obrigatorias/${usuarioId}`,
    dados,
  );

  return response.data;
};

export const listarCronogramasObrigatorios = async (
  usuarioId: number,
): Promise<CronogramaObrigatorio[]> => {
  const response = await api.get(
    `/api/atividades-obrigatorias/${usuarioId}`,
  );

  const payload = response.data as
    | CronogramaObrigatorio[]
    | { atividades?: CronogramaObrigatorio[] }
    | { data?: CronogramaObrigatorio[] }
    | { content?: CronogramaObrigatorio[] }
    | null
    | undefined;

  if (Array.isArray(payload)) {
    return payload;
  }

  const cronograma = payload as {
    atividades?: CronogramaObrigatorio[];
    data?: CronogramaObrigatorio[];
    content?: CronogramaObrigatorio[];
  } | null | undefined;

  if (cronograma && Array.isArray(cronograma.atividades)) {
    return cronograma.atividades;
  }

  if (cronograma && Array.isArray(cronograma.data)) {
    return cronograma.data;
  }

  if (cronograma && Array.isArray(cronograma.content)) {
    return cronograma.content;
  }

  return [];
};

export const obterCronogramaObrigatorio = async (
  usuarioId: number,
  id: number,
): Promise<CronogramaObrigatorio> => {
  const response: AxiosResponse<CronogramaObrigatorio> = await api.get(
    `/api/atividades-obrigatorias/${usuarioId}/${id}`,
  );

  return response.data;
};

export const editarCronogramaObrigatorio = async ({
  usuarioId,
  id,
  dados,
}: EditarCronogramaObrigatorioParams): Promise<CronogramaObrigatorio> => {
  const response: AxiosResponse<CronogramaObrigatorio> = await api.put(
    `/api/atividades-obrigatorias/${usuarioId}/${id}`,
    dados,
  );

  return response.data;
};

export const deletarCronogramaObrigatorio = async ({
  usuarioId,
  id,
}: DeletarCronogramaObrigatorioParams): Promise<void> => {
  await api.delete(`/api/atividades-obrigatorias/${usuarioId}/${id}`);
};
