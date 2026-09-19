import { useEffect, useRef } from "react";
import { buscarLembreteNaoEnviado } from "@/api/lembretes/lembrete.service";
import type { Lembrete } from "@/api/lembretes/schema";
import { toast } from "@/components/ui/toast";

const INTERVALO_BUSCA_LEMBRETE = 5_000;

const rotuloTipoLembrete: Record<string, string> = {
  TRINTA_MINUTOS_ANTES: "30 minutos antes",
  QUINZE_MINUTOS_ANTES: "15 minutos antes",
  HORARIO: "agora",
};

function chaveLembrete(lembrete: Lembrete): string {
  return [
    lembrete.id,
    lembrete.hora,
    lembrete.diaSemana,
    lembrete.tipoLembrete,
  ].join(":");
}

function mensagemLembrete(lembrete: Lembrete): string {
  const tipo = rotuloTipoLembrete[lembrete.tipoLembrete ?? ""] ?? lembrete.tipoLembrete;
  const titulo = lembrete.atividadeObrigatoriaTitulo?.trim();

  if (titulo) {
    return `Você tem um lembrete para ${titulo} ${tipo ? `(${tipo})` : ""}, às ${lembrete.hora}.`;
  }

  return `Você tem um lembrete para ${tipo ?? "esta atividade"}, às ${lembrete.hora}.`;
}

export function LembreteWatcher() {
  const ultimoLembreteExibido = useRef<string | null>(null);

  useEffect(() => {
    let desmontado = false;

    const buscarLembrete = async () => {
      console.log("[LembreteWatcher] Verificando lembrete em:", new Date().toLocaleTimeString("pt-BR"));

      try {
        const lembrete = await buscarLembreteNaoEnviado();
        console.log("[LembreteWatcher] Resposta recebida:", lembrete);

        if (
          desmontado ||
          !lembrete ||
          ultimoLembreteExibido.current === chaveLembrete(lembrete)
        ) {
          console.log("[LembreteWatcher] Nenhum lembrete novo para exibir.");
          return;
        }

        ultimoLembreteExibido.current = chaveLembrete(lembrete);
        console.info("[LembreteWatcher] Exibindo lembrete na tela:", lembrete);
        toast.add({
          title: "Lembrete",
          description: mensagemLembrete(lembrete),
          type: "info",
        });
      } catch (error) {
        console.error("[LembreteWatcher] Erro ao buscar lembrete não enviado:", error);
      }
    };

    void buscarLembrete();
    const intervalo = window.setInterval(() => void buscarLembrete(), INTERVALO_BUSCA_LEMBRETE);

    return () => {
      desmontado = true;
      window.clearInterval(intervalo);
    };
  }, []);

  return null;
}