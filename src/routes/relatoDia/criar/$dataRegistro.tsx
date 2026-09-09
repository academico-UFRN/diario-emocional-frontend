import { Heading } from '@/components/others/typography';
import { Button } from '@/components/ui/button';

import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { RelatoForm } from '../-components/form';

import { CriarRelatoDia } from '@/api/relato-dia/relato-dia.service';

import type { RelatoDiaCriarRequest } from '@/api/relato-dia/schema';


export const Route = createFileRoute('/relatoDia/criar/$dataRegistro')({
  component: RouteComponent,
});


function RouteComponent() {

    function formatarDataDoJava(dataString: string): string {
  if (!dataString) return ''; 

  const [ano, mes, dia] = dataString.split('-');

  return `${dia}/${mes}/${ano}`;
}


  const { dataRegistro } = useParams({
    from: Route.id
  }) as {
    dataRegistro: string;
  };

  const navigate = useNavigate();

  const [mostrarSucesso, setMostrarSucesso] = useState(false);


  const mutation = useMutation({
    mutationFn: (dados: RelatoDiaCriarRequest) =>
      CriarRelatoDia(dados, 1),

    onSuccess: () => {
      setMostrarSucesso(true);
    },
  });


function handleSubmit(dados: Omit<RelatoDiaCriarRequest, 'dataRegistro'>) {
  console.log("Dados enviados:", dados);
  mutation.mutate({
    dataRegistro,
    titulo: dados.titulo,
    conteudoHtml: dados.conteudoHtml,
    favorito: dados.favorito,
  });
}


  function voltarParaRelatos() {

    setMostrarSucesso(false);

    navigate({
      to: '/relatoDia',
    });
  }


  return (
    <>
      <main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">

        <Heading as="h1" variant="h1">
          {formatarDataDoJava(dataRegistro)}
        </Heading>


        <RelatoForm
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
        />


        {mutation.isError && (
          <p className="text-red-500">
            Erro ao criar o relato.
          </p>
        )}

      </main>


      {mostrarSucesso && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="relato-criado-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 id="relato-criado-title" className="text-lg font-semibold">
              Relato criado com sucesso! 🎉
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seu relato foi salvo com sucesso.
            </p>
            <Button className="mt-6" onClick={voltarParaRelatos}>
              Voltar para meus relatos
            </Button>
          </div>
        </div>
      )}
    </>
  );
}