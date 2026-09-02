import { HugeiconsIcon } from "@hugeicons/react";
import { Controller, type UseFormReturn } from "react-hook-form";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { especificFeelingsToChoose } from "../-data-emotion";
import type { CreateFeelingData } from "./form";

export const EspecificFeelingsComponent = (
	form: UseFormReturn<CreateFeelingData>,
) => {
	return (
		<FieldGroup>
			<Controller
				name="especificFeelings"
				control={form.control}
				render={({ field }) => (
					<Field data-invalid={form.formState.errors.especificFeelings}>
						<FieldLabel htmlFor="especificFeelings">
							Selecione os sentimentos específicos que você está sentindo hoje:
							*
						</FieldLabel>
						<ToggleGroup
							multiple
							variant="outline"
							value={field.value?.map((item) => String(item.id)) ?? []}
							onValueChange={(values) => {
								const selectedFeelings = values.map((value) => {
									const id = value;
									const selectedFeeling = field.value?.find(
										(item) => item.id === id,
									);

									return {
										id,
										intensity: selectedFeeling?.intensity ?? 1,
									};
								});

								field.onChange(selectedFeelings);
							}}
							className="flex-wrap justify-start gap-2"
						>
							{especificFeelingsToChoose.map((item) => {
								const selectedFeeling = field.value?.find(
									(value) => value.id === item.id,
								);
								const isSelected = !!selectedFeeling;

								return (
									<div key={item.id} className="flex items-center">
										<ToggleGroupItem
											key={item.id}
											value={String(item.id)}
											aria-label={item.name}
											className="aria-pressed:rounded-r-none"
										>
											<span className="flex items-center gap-2">
												<HugeiconsIcon
													icon={item.icon}
													strokeWidth={2}
													className="size-5"
													primaryColor={item.primaryColor}
												/>
												<p>
													{item.name
														? item.name.charAt(0).toUpperCase() +
															item.name.slice(1).toLowerCase()
														: ""}
												</p>
											</span>
										</ToggleGroupItem>
										{isSelected && (
											<Select
												id={`intensity-${item.id}`}
												value={String(selectedFeeling.intensity)}
												onValueChange={(value) => {
													const updatedFeelings = (field.value ?? []).map(
														(current) =>
															current.id === item.id
																? { ...current, intensity: Number(value) }
																: current,
													);

													field.onChange(updatedFeelings);
												}}
											>
												<SelectTrigger className="rounded-l-none border-l-0">
													<SelectValue placeholder="Selecione a intensidade">
														{
															[
																"Quase nunca",
																"Pouco",
																"Ás vezes",
																"Constantemente",
																"O tempo todo",
															][selectedFeeling.intensity - 1]
														}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1">Quase nunca</SelectItem>
													<SelectItem value="2">Pouco</SelectItem>
													<SelectItem value="3">Ás vezes</SelectItem>
													<SelectItem value="4">Constantemente</SelectItem>
													<SelectItem value="5">O tempo todo</SelectItem>
												</SelectContent>
											</Select>
										)}
									</div>
								);
							})}
						</ToggleGroup>
						<FieldError>
							{form.formState.errors.especificFeelings?.message}
						</FieldError>
					</Field>
				)}
			></Controller>
		</FieldGroup>
	);
};
