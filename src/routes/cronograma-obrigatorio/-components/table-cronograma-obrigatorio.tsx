import { Delete, Edit, Sad01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { listarCronogramasObrigatorios, deletarCronogramaObrigatorio } from "@/api/cronograma-obrigatorio/cronograma-obrigatorio.service";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogDestructive } from "@/components/-/dialog-destructive";
import { queryClient } from "@/lib/react-query";

const LABEL_DIAS: Record<string, string> = {
  SEGUNDA: "Segunda",
  TERCA: "Terça",
  QUARTA: "Quarta",
  QUINTA: "Quinta",
  SEXTA: "Sexta",
  SABADO: "Sábado",
  DOMINGO: "Domingo",
};

export function TableCronogramaObrigatorio() {
  const useQueryClient = queryClient;

  const { data, isPending } = useQuery({
    queryKey: ["cronograma-obrigatorio"],
    queryFn: () => listarCronogramasObrigatorios(1),
    staleTime: 1000 * 60 * 5,
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

  if (!data || data.length === 0) {
    return (
      <div className="flex h-200 flex-col items-center justify-center gap-4">
        <HugeiconsIcon icon={Sad01Icon} strokeWidth={2} className="text-muted-foreground" />
        <p className="text-muted-foreground">Nenhuma atividade obrigatória encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => (
        <Card key={item.id ?? `${item.titulo}-${item.horaInicio}`}>
          <CardHeader className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{item.titulo}</CardTitle>
              <CardDescription>
                {item.subtitulo || "Sem subtítulo"}
              </CardDescription>
            </div>

            {item.ativo ? (
              <Badge variant="secondary">Ativa</Badge>
            ) : (
              <Badge variant="outline">Inativa</Badge>
            )}
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{item.horaInicio} - {item.horaFim}</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.diasDaSemana.map((dia) => (
                <Badge key={`${item.id}-${dia}`} variant="secondary">
                  {LABEL_DIAS[dia] ?? dia}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Link
              className={`border! border-border! ${buttonVariants({ variant: "outline", size: "lg" })}`}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
