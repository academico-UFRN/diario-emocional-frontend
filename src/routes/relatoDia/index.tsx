import { Edit, Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BuscarSugestaoRelatoDia,
  ListarRelatosDia,
} from "@/api/relato-dia/relato-dia.service";
import { Heading } from "@/components/-/typography";
import { obterUsuarioId } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExcluirRelato } from "./-components/excluir-relato";

export const Route = createFileRoute("/relatoDia/")({
  component: RouteComponent,
});

function formatarDataDoJava(dataString: string): string {
  if (!dataString) return "";

  const [ano, mes, dia] = dataString.split("-");

  return `${dia}/${mes}/${ano}`;
}

function RouteComponent() {
  const usuarioId = obterUsuarioId();
  const [sugestao, setSugestao] = useState<string | null>(null);
  const [erroSugestao, setErroSugestao] = useState<string | null>(null);

  useEffect(() => {
    const hoje = new Date().toISOString().split("T")[0];

    const chaveSugestao = `sugestaoRelatoDia-${usuarioId}`;
    const sugestaoSalva = localStorage.getItem(chaveSugestao);

    if (sugestaoSalva) {
      try {
        const dados: unknown = JSON.parse(sugestaoSalva);

        if (
          dados &&
          typeof dados === "object" &&
          "data" in dados &&
          "sugestao" in dados &&
          "statusCode" in dados &&
          dados.data === hoje &&
          typeof dados.sugestao === "string" &&
          dados.sugestao.trim() &&
          dados.statusCode === 200
        ) {
          setSugestao(dados.sugestao);
          return;
        }

        localStorage.removeItem(chaveSugestao);
      } catch {
        localStorage.removeItem(chaveSugestao);
      }
    }

    console.log("Requisição de sugestão do relato do dia:", { usuarioId });

    BuscarSugestaoRelatoDia(usuarioId)
      .then((response) => {
        const textoSugestao = response.trim();

        if (!textoSugestao) {
          setErroSugestao("O servidor respondeu sem conteúdo para a sugestão.");
          return;
        }

        const dados = {
          sugestao: textoSugestao,
          data: hoje,
          statusCode: 200,
        };

        localStorage.setItem(chaveSugestao, JSON.stringify(dados));

        setSugestao(textoSugestao);
      })
      .catch((error: unknown) => {
        setSugestao(null);
        setErroSugestao(null);

        if (import.meta.env.DEV) {
          console.error("Erro ao buscar sugestão do relato do dia:", error);
        }
      });
  }, [usuarioId]);

  const { data } = useQuery({
    queryKey: ["relatoDia", usuarioId],
    queryFn: () => ListarRelatosDia(usuarioId),
  });

  const hoje = new Date();
  const dataRegistro = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="flex flex-col gap-8 p-4 max-w-270 w-full mx-auto">
      <header className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Heading as="h1" variant="h3">
            Relato do dia
          </Heading>
          <Link
            to={`/relatoDia/criar/$dataRegistro`}
            params={{ dataRegistro: dataRegistro }}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <HugeiconsIcon icon={Plus} strokeWidth={2} />
            Adicionar Relato
          </Link>
        </div>

        <p>
          Aqui você pode editar, deletar e acompanhar seus relatos diários ao
          longo do tempo.
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
      {erroSugestao && (
        <p role="alert" className="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
          {erroSugestao}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {data?.map((relato) => (
          <Card key={relato.dataRegistro} className="relative">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>{formatarDataDoJava(relato.dataRegistro)}</CardTitle>
                <CardTitle>{relato.titulo}</CardTitle>
              </div>
              <Heart
                className="size-6"
                color="hotpink"
                fill={relato.favorito ? "hotpink" : "none"}
              />
            </CardHeader>

            {/* Torna o Card inteiro clicável de forma nativa e limpa */}
            <Link
              to="/relatoDia/individual/$dataRegistro"
              params={{ dataRegistro: relato.dataRegistro }}
              className="absolute inset-0 z-0"
            />

            <CardFooter className="flex justify-end gap-2 z-10 relative">
              <Button variant="outline">
                <Link
                  to="/relatoDia/editar/$dataRegistro"
                  params={{ dataRegistro: relato.dataRegistro }}
                  className="flex items-center gap-2"
                >
                  <HugeiconsIcon icon={Edit} strokeWidth={2} />
                  <p>Editar relato</p>
                </Link>
              </Button>

              <ExcluirRelato dataRegistro={relato.dataRegistro} usuarioId={usuarioId} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
