import { BuscarRelatoDia } from '@/api/relato-dia/relato-dia.service';
import { Heading } from '@/components/-/typography'
import { Button } from "@/components/ui/button";
import { Edit } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Heart as PhosphorHeart } from "@phosphor-icons/react";
import Markdown from 'react-markdown';
import { ExcluirRelato } from '../-components/excluir-relato';


export const Route = createFileRoute('/relatoDia/individual/$dataRegistro')({
  component: RouteComponent,
  notFoundComponent: () =>
    <main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
      <Heading as="h1" variant="h1"> Não foi encontrado o relato do dia </Heading>
    </main>
})


function RouteComponent() {

  const { dataRegistro } = useParams({ from: Route.id }) as {
    dataRegistro: string;
  };

  function formatarDataDoJava(dataString: string): string {
    if (!dataString) return '';

    const [ano, mes, dia] = dataString.split('-');

    return `${dia}/${mes}/${ano}`;
  }


  const { data } = useQuery({
    queryKey: ["relatoDia", dataRegistro, 1],
    queryFn: () => BuscarRelatoDia(dataRegistro, 1),
  });


  return (
    <main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <Heading as="h2" variant="h1">
            {data?.titulo}
          </Heading>
          <Heading as="h3" variant="h2" className="border-none">
            {formatarDataDoJava(String(data?.dataRegistro))}
          </Heading>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <PhosphorHeart size={32} color="hotpink" weight={data?.favorito ? "fill" : "regular"} />
          </div>
          <Button variant="outline" className="" onClick={(event) => { event.stopPropagation(); window.location.href = `/relatoDia/editar/${data?.dataRegistro}`; }}>
            <HugeiconsIcon icon={Edit} strokeWidth={2} />
            Editar Relato
          </Button>
          <ExcluirRelato
            dataRegistro={formatarDataDoJava(String(data?.dataRegistro))}
            usuarioId={1}
          />
        </div>
      </header>
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data?.conteudoHtml ?? "" }}
      />

    </main>
  )
}
