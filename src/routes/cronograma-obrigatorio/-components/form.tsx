import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import {
  CronogramaObrigatorioInputSchema,
  type DiaSemana,
} from "@/api/cronograma-obrigatorio/schema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const DIAS_SEMANA: { value: DiaSemana; label: string }[] = [
  { value: "SEGUNDA", label: "Seg" },
  { value: "TERCA", label: "Ter" },
  { value: "QUARTA", label: "Qua" },
  { value: "QUINTA", label: "Qui" },
  { value: "SEXTA", label: "Sex" },
  { value: "SABADO", label: "Sáb" },
  { value: "DOMINGO", label: "Dom" },
];

type FormCronogramaObrigatorioValues = {
  titulo: string;
  subtitulo?: string | null;
  horaInicio: string;
  horaFim: string;
  diasDaSemana: DiaSemana[];
  ativo: boolean;
};

interface FormCronogramaObrigatorioProps {
  initialValues?: Partial<FormCronogramaObrigatorioValues>;
  onSubmit: (data: FormCronogramaObrigatorioValues) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  submitText?: string;
}

export function FormCronogramaObrigatorio({
  initialValues,
  onSubmit,
  isPending,
  isSuccess,
  submitText = "Salvar",
}: FormCronogramaObrigatorioProps) {
  const form = useForm<FormCronogramaObrigatorioValues>({
    resolver: zodResolver(CronogramaObrigatorioInputSchema),
    defaultValues: {
      titulo: "",
      subtitulo: "",
      horaInicio: "",
      horaFim: "",
      diasDaSemana: [],
      ativo: true,
      ...initialValues,
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <FieldGroup>
        <Controller
          name="titulo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input id="titulo" placeholder="Ex: Academia" {...field} />
              <FieldError>{form.formState.errors.titulo?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="subtitulo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="subtitulo">Subtítulo</FieldLabel>
              <Input
                id="subtitulo"
                placeholder="Ex: Treino da manhã"
                {...field}
                value={field.value ?? ""}
              />
              <FieldError>{form.formState.errors.subtitulo?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="@md/field-group:flex-row @md/field-group:gap-4">
        <Controller
          name="horaInicio"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel htmlFor="horaInicio">Hora de início</FieldLabel>
              <Input id="horaInicio" type="time" {...field} />
              <FieldError>{form.formState.errors.horaInicio?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="horaFim"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldLabel htmlFor="horaFim">Hora de fim</FieldLabel>
              <Input id="horaFim" type="time" {...field} />
              <FieldError>{form.formState.errors.horaFim?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="diasDaSemana"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="diasDaSemana">Dias da semana</FieldLabel>

              <ToggleGroup
                id="diasDaSemana"
                multiple
                variant="outline"
                className="flex-wrap justify-start gap-2"
                value={field.value ?? []}
                onValueChange={(values) => field.onChange(values as DiaSemana[])}
              >
                {DIAS_SEMANA.map((dia) => (
                  <ToggleGroupItem
                    key={dia.value}
                    value={dia.value}
                    aria-label={dia.label}
                  >
                    {dia.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <FieldError>
                {form.formState.errors.diasDaSemana?.message}
              </FieldError>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Spinner />
          ) : isSuccess ? (
            <HugeiconsIcon icon={CheckIcon} strokeWidth={2} />
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}
