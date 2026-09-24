import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowDown,
    ChevronDown,
    ShieldCheck,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Field,
    FieldError,
    FieldGroup,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatInputSchema = z.object({
    mensagem: z.string().min(1, "A mensagem não pode ser vazia"),
});

interface InputChatProps {
    isPending?: boolean;
    onSubmit: (mensagem: string) => void;
}

export const InputChat = ({ onSubmit, isPending }: InputChatProps) => {

    const form = useForm<z.infer<typeof ChatInputSchema>>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            mensagem: "",
        },
    });


    return (
        <form
            id="chat-input-form"
            onSubmit={form.handleSubmit((data) => {
                onSubmit(data.mensagem)
                form.resetField("mensagem");
            })}
            className="flex flex-col gap-2 pb-6 w-full"
        >
            <div
                className={`flex items-center py-2 px-4 bg-input rounded-3xl mx-auto w-full max-w-4xl gap-0 relative ${form.getValues("mensagem").length > 80 && "flex-col items-end"}`}
            >
                <FieldGroup>
                    <Controller
                        name="mensagem"
                        control={form.control}
                        render={({ field }) => (
                            <Field data-invalid={form.formState.errors.mensagem}>
                                {!field.value && (
                                    <div className="absolute top-5 left-7 pointer-events-none flex items-center gap-2 text-muted-foreground select-none text-sm">
                                        <ShieldCheck className="size-4" />
                                        <span>Fale sobre seu dia...</span>
                                    </div>
                                )}
                                <Textarea
                                    {...field}
                                    className="w-full max-h-28 min-h-10 bg-transparent border-0 border-gray-300 focus:border-blue-500  focus-visible:border-transparent focus-visible:ring-0"
                                    rows={3}
                                    disabled={isPending}
                                />
                                <FieldError>
                                    {form.formState.errors.mensagem?.message}
                                </FieldError>
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={<Button variant="ghost" />}
                                    disabled={true}
                                    className=""
                                >
                                    gemini-3.5-flash-lite
                                    <ChevronDown className="size-4" />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Novos modelos em breve</p>
                        </TooltipContent>
                    </Tooltip>
                    {form.watch("mensagem") && (
                        <Button
                            type="submit"
                            variant={"default"}
                            size={"icon-sm"}
                            className="w-fit size-8 animate-in zoom-in-75 duration-200"
                        >
                            <ArrowDown />
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
};
