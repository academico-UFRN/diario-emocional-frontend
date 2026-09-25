import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Search, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { deletarChat, listarChats } from "@/api/chat/chat.service";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { queryClient } from "@/lib/react-query";

export const SidebarChat = () => {
    const useQueryClient = queryClient;
    const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

    const { data, isPending } = useQuery({
        queryKey: ["listarChats"],
        queryFn: () => listarChats({ usuarioId: 1 }),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: deletarChat,
        onSuccess: () => {
            useQueryClient.invalidateQueries({ queryKey: ["listarChats"] });
        },
    });

    return (
        <Sidebar collapsible="none">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={
                                <Link
                                    to="/chat/novo"
                                    className="flex items-center gap-2 [&.active]:bg-blue-500/20"
                                >
                                    <SquarePen className="size-4" />
                                    Novo Chat
                                </Link>
                            }
                        />
                        <SidebarMenuBadge>New</SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Search className="size-4" />
                            Pesquisar
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {isPending ? <Spinner /> : !data ? "Nenhum chat" : "Recentes"}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {data?.map((chat) => (
                            <SidebarMenuItem
                                key={chat.id}
                                className="group [&.active]:bg-blue-500/20"
                            >
                                <SidebarMenuButton
                                    render={
                                        <Link
                                            to={`/chat/$chatId`}
                                            params={{ chatId: chat.id }}
                                            className=" h-fit flex items-center gap-2"
                                        >
                                            {chat.titulo}
                                        </Link>
                                    }
                                />
                                <SidebarMenuAction
                                    className={`${isDeleting && chat.id === deletingChatId ? "" : "hidden group-hover:block"}`}
                                    onClick={() => {
                                        setDeletingChatId(chat.id);
                                        mutate({ chatId: chat.id });
                                    }}
                                >
                                    {isDeleting ? <Spinner /> : <Trash className="size-4" />}
                                </SidebarMenuAction>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
};
