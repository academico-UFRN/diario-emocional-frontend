import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { SentimentoSchema } from "@/api/avaliacao-sentimento/schema";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GATILHOS } from "../-data/-data-emotion";
import { EspecificFeelingsComponent } from "./form-criar-sentimentos";
import { CareComponent } from "./slider-feeling-status";

const formSchema = z.object({
	avaliacaoDia: z
		.number()
		.min(1, "A avaliação do dia deve ser entre 1 e 5")
		.max(5, "A avaliação do dia deve ser entre 1 e 5"),
	sentimentos: z
		.array(SentimentoSchema)
		.min(1, "Selecione pelo menos um sentimento"),
	gatilhos: z.array(z.string()).optional(),
	textoLivre: z.string().optional(),
});

export type FormEmotionValues = z.infer<typeof formSchema>;

interface FormEmotionProps {
	initialValues?: Partial<FormEmotionValues>;
	onSubmit: (data: FormEmotionValues) => void;
	isPending?: boolean;
	submitText?: string;
}

export const FormEmotion = ({
	initialValues,
	onSubmit,
	isPending,
	submitText = "Salvar",
}: FormEmotionProps) => {
	const form = useForm<FormEmotionValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			avaliacaoDia: 3,
			sentimentos: [],
			gatilhos: [],
			textoLivre: "",
			...initialValues,
		},
	});

	return (
		<form
			id="create-feeling-form"
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex flex-col gap-8"
		>
			<FieldGroup>
				<Controller
					name="avaliacaoDia"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<CareComponent value={field.value ?? 0} />
							<FieldLabel htmlFor="feeling">Como está o dia hoje?</FieldLabel>
							<Slider
								min={1}
								max={5}
								step={1}
								{...field}
								value={[field.value ?? 0]}
								onValueChange={(vals) => field.onChange(vals)}
							/>
						</Field>
					)}
				/>
			</FieldGroup>
			{EspecificFeelingsComponent(form)}
			<FieldGroup>
				<Controller
					name="gatilhos"
					control={form.control}
					render={({ field }) => (
						<Field data-invalid={form.formState.errors.gatilhos}>
							<FieldLabel htmlFor="gatilhos">
								Selecione os gatilhos que podem ter influenciado seus
								sentimentos hoje:
							</FieldLabel>
							<ToggleGroup
								multiple
								variant="outline"
								className="flex-wrap justify-start gap-2"
								value={field.value?.map(String) ?? []}
								onValueChange={(values) => field.onChange(values.map(String))}
							>
								{GATILHOS.map((item) => (
									<ToggleGroupItem
										key={item.id}
										value={item.id}
										aria-label={item.name}
										className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
									>
										<HugeiconsIcon
											icon={item.icon}
											strokeWidth={2}
											className="size-5"
										/>
										{item.name}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
							<FieldError>{form.formState.errors.gatilhos?.message}</FieldError>
						</Field>
					)}
				></Controller>
			</FieldGroup>
			<FieldGroup>
				<Controller
					name="textoLivre"
					control={form.control}
					render={({ field }) => (
						<Field data-invalid={form.formState.errors.textoLivre}>
							<FieldLabel htmlFor="textoLivre">
								Quer compartilhar mais sobre seus sentimentos hoje?
							</FieldLabel>
							<Textarea {...field} />
						</Field>
					)}
				/>
			</FieldGroup>
			<div className="flex justify-end">
				<Button type="submit" disabled={isPending}>
					{isPending ? (
						<>
							<Spinner />
							Salvando...
						</>
					) : (
						submitText
					)}
				</Button>
			</div>
		</form>
	);
};
