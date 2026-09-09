import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete } from "@hugeicons/core-free-icons";

import { DeletarRelatoDia } from "@/api/relato-dia/relato-dia.service";

interface ExcluirRelatoProps {
  dataRegistro: string;
  usuarioId: number;
}

export function ExcluirRelato({
  dataRegistro,
  usuarioId,
}: ExcluirRelatoProps) {

  const [aberto, setAberto] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      DeletarRelatoDia(dataRegistro, usuarioId),

    onSuccess: () => {
      setAberto(false);

      queryClient.invalidateQueries({
        queryKey: ["relatoDia"],
      });
    },
  });

  function confirmarExclusao() {
    mutation.mutate();
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setAberto(true);
        }}
      >
        <HugeiconsIcon
          icon={Delete}
          strokeWidth={2}
        />

        Deletar Relato
      </Button>


      <Dialog
        open={aberto}
        onOpenChange={setAberto}
      >
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              Deletar relato
            </DialogTitle>

            <DialogDescription>
              Tem certeza que deseja deletar este relato?
              Essa ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>


          {mutation.isError && (
            <p className="text-sm text-red-500">
              Não foi possível deletar o relato.
            </p>
          )}


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setAberto(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>


            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Excluindo..."
                : "Excluir"}
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    </>
  );
}