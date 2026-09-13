import { Delete, Edit, Sad01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  listarCronogramasObrigatorios,
  deletarCronogramaObrigatorio,
} from "@/api/cronograma-obrigatorio/cronograma-obrigatorio.service";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DialogDestructive } from "@/components/-/dialog-destructive";
import { queryClient } from "@/lib/react-query";

const DIAS_SEMANA: Array<keyof typeof LABEL_DIAS> = [
  "SEGUNDA",
  "TERCA",
  "QUARTA",
  "QUINTA",
  "SEXTA",
  "SABADO",
  "DOMINGO",
];

const LABEL_DIAS = {
  SEGUNDA: "Segunda",
  TERCA: "Terça",
  QUARTA: "Quarta",
  QUINTA: "Quinta",
  SEXTA: "Sexta",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
} as const;

const DIA_SEMANA_MAP: Record<number, (typeof DIAS_SEMANA)[number]> = {
  0: "DOMINGO",
  1: "SEGUNDA",
  2: "TERCA",
  3: "QUARTA",
  4: "QUINTA",
  5: "SEXTA",
  6: "SABADO",
};

function getSemanaAtual() {
  const hoje = new Date();
  const diffParaSegunda = (hoje.getDay() + 6) % 7;
  const inicioDaSemana = new Date(hoje);

  inicioDaSemana.setHours(0, 0, 0, 0);
  inicioDaSemana.setDate(hoje.getDate() - diffParaSegunda);

  return Array.from({ length: 7 }, (_, index) => {
    const data = new Date(inicioDaSemana);
    data.setDate(inicioDaSemana.getDate() + index);

    const diaKey = DIA_SEMANA_MAP[data.getDay() as keyof typeof DIA_SEMANA_MAP];

    return {
      diaKey,
      data,
      label: LABEL_DIAS[diaKey],
      dataFormatada: data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      isHoje: data.toDateString() === hoje.toDateString(),
    };
  });
}

export function TableCronogramaObrigatorio() {
  const useQueryClient = queryClient;

  const { data, isPending } = useQuery({
    queryKey: ["cronograma-obrigatorio"],
    queryFn: () => listarCronogramasObrigatorios(1),
    staleTime: 1000 * 60 * 5,
  });

  const cronogramas = Array.isArray(data) ? data : [];
  const diasDaSemanaAtual = getSemanaAtual();
  const tarefasPorDia = Object.fromEntries(
    DIAS_SEMANA.map((dia) => [dia, [] as typeof cronogramas]),
  ) as Record<(typeof DIAS_SEMANA)[number], typeof cronogramas>;

  cronogramas.forEach((item) => {
    item.diasDaSemana.forEach((dia) => {
      const diaKey = dia as (typeof DIAS_SEMANA)[number];
      if (tarefasPorDia[diaKey]) {
        tarefasPorDia[diaKey].push(item);
      }
    });
  });

  const mutateDelete = useMutation({
    mutationFn: deletarCronogramaObrigatorio,
    onSuccess: () => {
      useQueryClient.invalidateQueries({ queryKey: ["cronograma-obrigatorio"] });
    },
  });

  function handleDelete(id: number): void {
    mutateDelete.mutate({ usuarioId: 1, id });
  }

  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center text-muted-foreground">
        Carregando atividades...
      </div>
    );
  }

  if (cronogramas.length === 0) {
    return (
      <div className="flex h-200 flex-col items-center justify-center gap-4">
        <HugeiconsIcon icon={Sad01Icon} strokeWidth={2} className="text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma atividade obrigatória encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {diasDaSemanaAtual.map(({ diaKey, dataFormatada, isHoje }) => (
              <th
                key={diaKey}
                className={[
                  "border-b border-border p-3 text-left text-sm font-semibold text-foreground",
                  isHoje ? "bg-primary/10" : "bg-muted/40",
                ].join(" ")}
              >
                <div className="flex flex-col">
                  <span>{LABEL_DIAS[diaKey]}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {dataFormatada}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="align-top">
            {diasDaSemanaAtual.map(({ diaKey, isHoje }) => (
              <td
                key={`${diaKey}-coluna`}
                className={[
                  "border-r border-border p-3 align-top last:border-r-0",
                  isHoje ? "bg-primary/5" : "bg-background",
                ].join(" ")}
              >
                <div className="flex min-h-52 flex-col gap-3">
                  {tarefasPorDia[diaKey].length > 0 ? (
                    tarefasPorDia[diaKey].map((item) => (
                      <div
                        key={item.id ?? `${item.titulo}-${item.horaInicio}`}
                        className="rounded-md border border-border bg-background p-3 shadow-sm"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground">{item.titulo}</p>
                            {item.subtitulo && (
                              <p className="text-xs text-muted-foreground">{item.subtitulo}</p>
                            )}
                          </div>

                          {item.ativo ? (
                            <Badge variant="secondary">Ativa</Badge>
                          ) : (
                            <Badge variant="outline">Inativa</Badge>
                          )}
                        </div>

                        <div className="mb-3">
                          <Badge variant="outline">
                            {item.horaInicio} - {item.horaFim}
                          </Badge>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Link
                            className={`border! border-border! ${buttonVariants({ variant: "outline", size: "sm" })}`}
                            to="/cronograma-obrigatorio/$id/editar"
                            params={{ id: String(item.id ?? "0") }}
                          >
                            <HugeiconsIcon icon={Edit} strokeWidth={2} />
                            Editar
                          </Link>

                          <DialogDestructive
                            title="Deseja deletar essa atividade?"
                            description="Esta ação não pode ser desfeita."
                            triggerNode={
                              <>
                                <HugeiconsIcon icon={Delete} strokeWidth={2} />
                                Deletar
                              </>
                            }
                            confirmNode={
                              <>
                                <HugeiconsIcon icon={Delete} strokeWidth={2} />
                                Deletar
                              </>
                            }
                            onConfirm={() => item.id !== undefined && handleDelete(item.id)}
                            isPending={mutateDelete.isPending}
                            isSuccess={mutateDelete.isSuccess}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem atividade</p>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
