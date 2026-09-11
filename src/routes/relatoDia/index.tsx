import { Heading } from '@/components/others/typography';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Delete, Edit } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { BuscarSugestaoRelatoDia, ListarRelatosDia } from '@/api/relato-dia/relato-dia.service';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Heart as PhosphorHeart } from "@phosphor-icons/react";
import { ExcluirRelato } from './-components/excluir-relato';
import { useEffect, useState } from 'react';


export const Route = createFileRoute('/relatoDia/')({
  component: RouteComponent,
})

function formatarDataDoJava(dataString: string): string {
  if (!dataString) return ''; 

  const [ano, mes, dia] = dataString.split('-');

  return `${dia}/${mes}/${ano}`;
}

function RouteComponent() {
  const [sugestao, setSugestao] = useState<string | null>(null);
  
  useEffect(() => {
  const hoje = new Date().toISOString().split("T")[0];

  const sugestaoSalva = localStorage.getItem("sugestaoRelatoDia");

  if (sugestaoSalva) {
    const dados = JSON.parse(sugestaoSalva);

    if (dados.data === hoje) {
      setSugestao(dados.sugestao);
      return;
    }
  }

  BuscarSugestaoRelatoDia(1)
    .then((response) => {
      console.log("Sugestão recebida:", response.sugestao);
      const dados = {
        sugestao: response.sugestao,
        data: hoje,
      };

      localStorage.setItem(
        "sugestaoRelatoDia",
        JSON.stringify(dados)
      );

      setSugestao(response.sugestao);
    })
    .catch((error) => {
      console.error("Erro ao buscar sugestão:", error);
    });
}, []);

	const { data } = useQuery({
		queryKey: ["relatoDia", 1],
		queryFn: () => ListarRelatosDia(1),
	});

	console.log(data);
	const hoje = new Date();
	const dataRegistro = [
	hoje.getFullYear(),
	String(hoje.getMonth() + 1).padStart(2, "0"),
	String(hoje.getDate()).padStart(2, "0"),
	].join("-");

  return(
  		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
				<Heading as="h1" variant="h1">
					Relato do dia
				</Heading>
				<button onClick={() => window.location.href = `/relatoDia/criar/${dataRegistro}`} className="bg-blue-500 text-white px-4 py-2 rounded">
				Criar Relato
				</button>
				</div>
                
                <p>
					Aqui você pode editar, deletar e acompanhar seus relatos diários ao longo
					do tempo.
				</p>

			</header>
          {sugestao && (
      <Card>
        <CardHeader>
          <CardTitle>Sugestão para o seu relato</CardTitle>
          <CardDescription>
            Uma ideia baseada nos seus relatos recentes.
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <p>{sugestao}</p>
        </CardFooter>
      </Card>
    )}

<div className="grid grid-cols-2 gap-4">
        {data?.map((relato) => (
          <Card key={relato.dataRegistro} className="p-4 relative">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{formatarDataDoJava(relato.dataRegistro)}</CardTitle>
                <CardTitle>{relato.titulo}</CardTitle>
              </div>
              <PhosphorHeart size={32} color="hotpink" weight={relato.favorito ? "fill" : "regular"} />
            </CardHeader>

            {/* Torna o Card inteiro clicável de forma nativa e limpa */}
            <Link 
              to="/relatoDia/individual/$dataRegistro" 
              params={{ dataRegistro: relato.dataRegistro }}
              className="absolute inset-0 z-0" 
            />

            <CardFooter className="flex justify-end gap-2 z-10 relative">
              <Button variant="outline" >
                <Link to="/relatoDia/editar/$dataRegistro" params={{ dataRegistro: relato.dataRegistro }} className="flex items-center gap-2">
                  <HugeiconsIcon icon={Edit} strokeWidth={2} />
                  <p>Editar relato</p>
                </Link>
              </Button>

              <ExcluirRelato
                dataRegistro={relato.dataRegistro}
                usuarioId={1}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}

