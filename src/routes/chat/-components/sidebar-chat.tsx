import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Search, SquarePen } from "lucide-react";
import { listarChats } from "@/api/chat/chat.service";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

export const SidebarChat = () => {
    const { data, isPending } = useQuery({
        queryKey: ["listarChats"],
        queryFn: () => listarChats({ usuarioId: 1 }),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return (
        <Sidebar collapsible="none">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={
                            <Link to="/chat/novo" className="flex items-center gap-2 [&.active]:bg-blue-500/20">
                                <SquarePen className="size-4" />
                                Novo Chat
                            </Link>
                        } />
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
                    <SidebarGroupLabel>{isPending ? <Spinner /> : !data ? "Nenhum chat" : "Recentes"}</SidebarGroupLabel>
                    <SidebarMenu>
                        {data?.map((chat) => (
                            <SidebarMenuItem key={chat.id}>
                                <SidebarMenuButton render={
                                    <Link to={`/chat/$chatId`} params={{ chatId: chat.id }} className=" h-fit flex items-center gap-2 [&.active]:bg-blue-500/20">
                                        {chat.titulo}
                                    </Link>
                                } />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
};
