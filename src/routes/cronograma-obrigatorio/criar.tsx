import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { criarCronogramaObrigatorio } from "@/api/cronograma-obrigatorio/cronograma-obrigatorio.service";
import type {
  CronogramaObrigatorio,
  CronogramaObrigatorioInput,
} from "@/api/cronograma-obrigatorio/schema";
import type { ErrorResponse } from "@/api/schemas";
import { Heading } from "@/components/-/typography";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { FormCronogramaObrigatorio } from "./-components/form";

export const Route = createFileRoute("/cronograma-obrigatorio/criar")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const useQueryClient = queryClient;

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: criarCronogramaObrigatorio,
    onSuccess: (newItem) => {
      useQueryClient.setQueryData<CronogramaObrigatorio[]>(
        ["cronograma-obrigatorio"],
        (currentItems: CronogramaObrigatorio[] = []) => [newItem, ...currentItems],
      );

      toast.add({
        title: "Sucesso",
        description: "Atividade adicionada com sucesso.",
        type: "success",
      });

      navigate({ to: "/cronograma-obrigatorio" });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.add({
        title:
          error.response?.data?.status && error.response?.data?.error
            ? `${error.response?.data?.status} - ${error.response?.data?.error}`
            : "Erro",
        description:
          error.response?.data?.message ||
          `Ocorreu um erro ao adicionar a atividade: ${error}`,
        type: "error",
      });
    },
  });

  function onSubmit(dados: CronogramaObrigatorioInput) {
    mutate({
      usuarioId: 1,
      dados,
    });
  }

  return (
    <main className="mx-auto flex max-w-270 flex-col gap-8 p-4">
      <header className="flex flex-col gap-4">
        <Heading as="h1" variant="h1">
          Nova atividade obrigatória
        </Heading>

        <p>
          Cadastre uma tarefa recorrente com horário e dias específicos da semana.
        </p>
      </header>

      <FormCronogramaObrigatorio
        onSubmit={onSubmit}
        isPending={isPending}
        isSuccess={isSuccess}
      />
    </main>
  );
}
