import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { enviarMensagemChat, obterChat } from "@/api/chat/chat.service";
import type { ChatResponse } from "@/api/chat/schema";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/react-query";
import { InputChat } from "./-components/chat-input-bar";
import { ChatScroller } from "./-components/chat-scroller";
import { SidebarChat } from "./-components/sidebar-chat";

export const Route = createFileRoute("/chat/$chatId")({
  component: RouteComponent,
  loader: ({ params }) => {
    const { chatId } = params;

    if (!chatId) {
      throw redirect({
        to: "/",
      });
    }
    return { chatId };
  },
});

function RouteComponent() {
  const useQueryClient = queryClient;

  const { chatId } = Route.useLoaderData();
  const [tempChatId, setTempChatId] = useState<string>(`temp-id-${Date.now()}`);
  const { data, isPending } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => obterChat({ chatId: chatId }),
    initialData: () =>
      useQueryClient.getQueryData<ChatResponse>(["chat", chatId]),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { isPending: isPendingMensagem, mutate: enviarMensagem } = useMutation({
    mutationFn: enviarMensagemChat,
    onSuccess: (data: ChatResponse) => {
      useQueryClient.setQueryData<ChatResponse>(
        ["chat", chatId],
        (currentChat: ChatResponse | undefined) => {
          if (!currentChat) return currentChat;
          return {
            ...currentChat,
            mensagens: [
              ...currentChat.mensagens.filter(
                (mensagem) => mensagem.id !== tempChatId,
              ),
              ...data.mensagens.slice(-2),
            ],
          };
        },
      );
      setTempChatId(`temp-id-${Date.now()}`);
    },
    onError: (error) => {
      useQueryClient.setQueryData<ChatResponse>(
        ["chat", chatId],
        (currentChat: ChatResponse | undefined) => {
          if (!currentChat) return currentChat;
          return {
            ...currentChat,
            mensagens: [
              ...currentChat.mensagens.filter(
                (mensagem) => mensagem.id !== tempChatId,
              ), // Remove a última mensagem temporária
            ],
          };
        },
      );

      toast.add({
        title: "Erro ao enviar mensagem",
        description: `Ocorreu um erro ao enviar a mensagem: ${error}`,
        type: "error",
      });
    },
  });

  function onSubmit(mensagem: string) {
    useQueryClient.setQueryData<ChatResponse>(
      ["chat", chatId],
      (currentChat: ChatResponse | undefined) => {
        if (!currentChat) return currentChat;
        return {
          ...currentChat,
          mensagens: [
            ...currentChat.mensagens,
            {
              id: tempChatId, // Usa o ID temporário
              papel: "USER",
              criadoEm: new Date().toISOString(),
              conteudo: mensagem,
            },
          ],
        };
      },
    );

    enviarMensagem({ usuarioId: 1, dados: { mensagem }, chatId: chatId });
  }

  return (
    <SidebarProvider className="h-full min-h-0">
      <SidebarChat />
      <div className="flex flex-col min-h-0 min-w-0 flex-1">
        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ChatScroller
            mensagens={data?.mensagens || []}
            isPending={isPendingMensagem}
          />
        )}
        <InputChat onSubmit={onSubmit} isPending={isPendingMensagem} />
      </div>
    </SidebarProvider>
  );
}
