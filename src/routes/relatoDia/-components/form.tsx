import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  RelatoDiaEditarDtoSchema,
  type RelatoDiaEditarDto,
} from "@/api/relato-dia/schema";

import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface RelatoFormProps {
  initialData?: RelatoDiaEditarDto;
  onSubmit: (data: RelatoDiaEditarDto) => void;
  isLoading?: boolean;
}

export function RelatoForm({
  initialData,
  onSubmit,
  isLoading = false,
}: RelatoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RelatoDiaEditarDto>({
    resolver: zodResolver(RelatoDiaEditarDtoSchema),
    // Sincroniza automaticamente sempre que initialData mudar
    values: initialData ?? {
      titulo: "",
      conteudoHtml: "",
      favorito: false,
    },
  });

  // O useEffect com reset() pode ser removido!

  const conteudoHtml = watch("conteudoHtml");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Título */}
      <div className="flex flex-col gap-2">
        <label htmlFor="titulo" className="font-medium">
          Digite um título para o seu relato.
        </label>
        <input
          id="titulo"
          {...register("titulo")}
          placeholder="Digite o título do relato"
          className="border rounded-lg p-3"
        />
        {errors.titulo && (
          <p className="text-sm text-red-500">{errors.titulo.message}</p>
        )}
      </div>

      {/* Favorito */}
      <div className="flex items-center gap-2">
        <input
          id="favorito"
          type="checkbox"
          {...register("favorito")}
        />
        <label htmlFor="favorito">Favoritar relato</label>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">
          Digite o conteúdo do seu relato...
        </label>

        <RichTextEditor
          content={conteudoHtml}
          onChange={(html) =>
            setValue("conteudoHtml", html, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />

        {errors.conteudoHtml && (
          <p className="text-sm text-red-500">
            {errors.conteudoHtml.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar relato"}
      </Button>
    </form>
  );
}