import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { criarChat } from "@/api/chat/chat.service";
import type { ChatResponse } from "@/api/chat/schema";
import { Heading } from "@/components/-/typography";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { InputChat } from "./chat-input-bar";
import { ChatScroller } from "./chat-scroller";
import { SidebarChat } from "./sidebar-chat";

export const Chat = () => {
    const navigate = useNavigate();
    const [mensagemInicial, setMensagemInicial] = useState<string>();

    const { isPending: isPendingCriarChat, mutate: criarMensagem } = useMutation({
        mutationFn: criarChat,
        onSuccess: (chat: ChatResponse) => {
            queryClient.setQueryData(["chat", chat.id], chat);
            navigate({
                to: "/chat/$chatId",
                params: { chatId: chat.id },
            });
        },
        onError: (error) => {
            setMensagemInicial(undefined);
            toast.add({
                title: "Erro ao criar chat",
                description: `Ocorreu um erro ao criar o chat: ${error}`,
                type: "error",
            });
        },
    });

    function onSubmit(mensagem: string) {
        setMensagemInicial(mensagem);
        criarMensagem({ usuarioId: 1, dados: { mensagem } });
    }

    return (
        <SidebarProvider className="h-full min-h-0">
            <SidebarChat />
            <div className="flex flex-col min-h-0 min-w-0 flex-1">
                {!mensagemInicial ? (
                    <div className="m-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 px-4">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="text-center text-muted-foreground">
                                Perguntas cirurgicas podem ajudar a esclarecer pensamentos e sentimentos.
                            </div>
                            <Heading variant={"h3"}>Diga aí, qual é o seu problema?</Heading>

                        </div>
                        <InputChat onSubmit={onSubmit} isPending={isPendingCriarChat} />
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 animate-in fade-in duration-300 flex-col">
                        <ChatScroller
                            mensagens={[
                                {
                                    id: "mensagem-inicial",
                                    papel: "USER",
                                    criadoEm: new Date().toISOString(),
                                    conteudo: mensagemInicial,
                                },
                            ]}
                            isPending={isPendingCriarChat}
                        />
                        <InputChat onSubmit={onSubmit} isPending={isPendingCriarChat} />
                    </div>
                )}
            </div>
        </SidebarProvider>
    );
};
