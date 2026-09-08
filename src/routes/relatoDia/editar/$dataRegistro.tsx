import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, createFileRoute } from "@tanstack/react-router";
import { BuscarRelatoDia, EditarRelatoDia } from "@/api/relato-dia/relato-dia.service";
import type { RelatoDiaEditarDto } from "@/api/relato-dia/schema";
import { RelatoForm } from "../-components/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute('/relatoDia/editar/$dataRegistro')({
  component: RouteComponent,
});

export function RouteComponent() {
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  function formatarDataDoJava(dataString: string): string {
    if (!dataString) return ''; 
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Pega os parâmetros da URL
  const { dataRegistro } = useParams({
    from: Route.id
  }) as {
    dataRegistro: string;
  };

  // 2. Busca o relato no backend
  const { data: relato, isLoading } = useQuery({
    queryKey: ["relatoDia", dataRegistro],
    queryFn: () => BuscarRelatoDia(dataRegistro, 1),
  });

  // 3. Cria a mutation para salvar as alterações
  const mutation = useMutation({
    mutationFn: (dadosAtualizados: RelatoDiaEditarDto) =>
      EditarRelatoDia(dataRegistro, 1, dadosAtualizados),
    onSuccess: () => {
      // Invalida o cache para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["relatoDia"] });
      // Abre o modal de sucesso
      setMostrarSucesso(true);
    },
  });

  // 4. Função para navegar após fechar o modal
  function voltarParaRelatos() {
    setMostrarSucesso(false);
    navigate({ to: "/relatoDia" });
  }

  // 5. Função disparada ao enviar o formulário
  function handleSalvar(dadosFormulario: RelatoDiaEditarDto) {
    mutation.mutate(dadosFormulario);
  }

  // 6. Estados de carregamento e validação
  if (isLoading) {
    return <div className="p-4 max-w-270 mx-auto">Carregando dados do relato...</div>;
  }

  if (!relato) {
    return <div className="p-4 max-w-270 mx-auto">Relato não encontrado.</div>;
  }

  return (
    <>
      <main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
        <h1 className="text-2xl font-bold">{formatarDataDoJava(relato.dataRegistro)}</h1>

        <RelatoForm
          key={relato.dataRegistro}
          initialData={relato}
          onSubmit={handleSalvar}
          isLoading={mutation.isPending}
        />
      </main>

      {mostrarSucesso && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="relato-editado-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 id="relato-editado-title" className="text-lg font-semibold">
              Relato atualizado com sucesso! 🎉
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Suas alterações foram salvas com sucesso.
            </p>
            <Button className="mt-6 w-full" onClick={voltarParaRelatos}>
              Voltar para meus relatos
            </Button>
          </div>
        </div>
      )}
    </>
  );
}