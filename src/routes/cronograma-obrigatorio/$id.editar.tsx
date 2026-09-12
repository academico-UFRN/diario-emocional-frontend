import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import {
  editarCronogramaObrigatorio,
  obterCronogramaObrigatorio,
  type EditarCronogramaObrigatorioParams,
} from "@/api/cronograma-obrigatorio/cronograma-obrigatorio.service";
import type { CronogramaObrigatorioInput } from "@/api/cronograma-obrigatorio/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { FormCronogramaObrigatorio } from "./-components/form";

export const Route = createFileRoute("/cronograma-obrigatorio/$id/editar")({
  loader: ({ params }) => {
    const { id } = params;

    if (!id) {
      throw redirect({
        to: "/cronograma-obrigatorio",
      });
    }

    return { id };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const useQueryClient = queryClient;
  const { id } = Route.useLoaderData();
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editarCronogramaObrigatorio,
    onSuccess: async () => {
      useQueryClient.invalidateQueries({ queryKey: ["cronograma-obrigatorio"] });
      toast.add({
        title: "Sucesso",
        description: "Atividade editada com sucesso.",
        type: "success",
      });

      await navigate({ to: "/cronograma-obrigatorio" });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.add({
        title:
          error.response?.data?.status && error.response?.data?.error
            ? `${error.response?.data?.status} - ${error.response?.data?.error}`
            : "Erro",
        description:
          error.response?.data?.message ||
          `Ocorreu um erro ao atualizar a atividade: ${error}`,
        type: "error",
      });
    },
  });

  const { data, isPending: isQueryPending, isSuccess: isQuerySuccess } = useQuery({
    queryKey: ["cronograma-obrigatorio", id],
    queryFn: () => obterCronogramaObrigatorio(1, Number(id)),
    staleTime: 1000 * 60 * 5,
  });

  function onSubmit(dados: CronogramaObrigatorioInput) {
    const payload: EditarCronogramaObrigatorioParams = {
      usuarioId: 1,
      id: Number(id),
      dados,
    };

    mutate(payload);
  }

  if (isQueryPending) {
    return (
      <main className="mx-auto flex max-w-270 flex-col gap-8 p-4">
        <header className="flex flex-col gap-4">
          <Skeleton className="h-12 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </header>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </main>
    );
  }

  if (isQuerySuccess && data) {
    const initialValues: CronogramaObrigatorioInput = {
      titulo: data.titulo,
      subtitulo: data.subtitulo ?? "",
      horaInicio: data.horaInicio,
      horaFim: data.horaFim,
      diasDaSemana: data.diasDaSemana,
      ativo: data.ativo,
    };

    return (
      <main className="mx-auto flex max-w-270 flex-col gap-8 p-4">
        <header className="flex flex-col gap-4">
          <Heading as="h1" variant="h1">
            Editar atividade obrigatória
          </Heading>

          <p>
            Ajuste o título, o horário e os dias da semana deste compromisso.
          </p>
        </header>

        <FormCronogramaObrigatorio
          onSubmit={onSubmit}
          initialValues={initialValues}
          isPending={isPending}
          isSuccess={isSuccess}
          submitText="Salvar alterações"
        />
      </main>
    );
  }

  return null;
}
