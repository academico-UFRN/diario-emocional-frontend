import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "./-components/chat";

export const Route = createFileRoute("/chat/novo")({
    component: RouteComponent,
});

function RouteComponent() {
    return <Chat />;
}