import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GATILHOS } from "../-data-emotion";
import { CareComponent } from "./care";
import { EspecificFeelingsComponent } from "./especificFeelings";

const feelingSchema = z.object({
	feeling: z
		.number()
		.min(-5, "Bateria física deve ser entre -5 e 5.")
		.max(5, "Bateria física deve ser entre -5 e 5."),

	especificFeelings: z
		.object({
			id: z.string(),
			intensity: z.number().min(1).max(5),
		})
		.array()
		.min(1, "Selecione pelo menos um sentimento específico."),

	triggers: z.string().array().optional(),
	freeText: z.string().optional(),
});

export type CreateFeelingData = z.infer<typeof feelingSchema>;

export const FormEmotion = () => {
	const form = useForm<CreateFeelingData>({
		resolver: zodResolver(feelingSchema),
		defaultValues: {
			feeling: 3,
			especificFeelings: [],
			triggers: [],
			freeText: "",
		},
	});

	function onSubmit(data: CreateFeelingData) {
		console.log("Form data:", data);
	}

	return (
		<form
			id="create-feeling-form"
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex flex-col gap-8"
		>
			<FieldGroup>
				<Controller
					name="feeling"
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
					name="triggers"
					control={form.control}
					render={({ field }) => (
						<Field data-invalid={form.formState.errors.triggers}>
							<FieldLabel htmlFor="triggers">
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
							<FieldError>{form.formState.errors.triggers?.message}</FieldError>
						</Field>
					)}
				></Controller>
			</FieldGroup>
			<FieldGroup>
				<Controller
					name="freeText"
					control={form.control}
					render={({ field }) => (
						<Field data-invalid={form.formState.errors.freeText}>
							<FieldLabel htmlFor="freeText">
								Quer compartilhar mais sobre seus sentimentos hoje?
							</FieldLabel>
							<Textarea {...field} />
						</Field>
					)}
				/>
			</FieldGroup>
			<div className="flex justify-end">
				<Button type="submit">Salvar avalição</Button>
			</div>
		</form>
	);
};
