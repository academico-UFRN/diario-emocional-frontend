// src/routes/__root.tsx

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { ModeToggle } from "@/components/-/mode-toggle";
import { Toaster } from "@/components/ui/toast";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex gap-8 justify-between p-2 border-b items-center shrink-0">
        <nav className="flex gap-4 item-center">
          <Link
            to="/"
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
          >
            <img src="/logo.png" alt="Logo" className="h-4 w-4" />
          </Link>
          <Link to="/relatoDia" className="group flex flex-col relative p-0">
            Relato do dia
            <div className="group-[&.active]:bg-blue-500 h-1 w-0 group-[&.active]:w-full transition-all duration-300 absolute bottom-[-15px]"></div>
          </Link>
          <Link to="/sentimentos" className="group flex flex-col relative p-0">
            Avaliação de sentimentos
            <div className="group-[&.active]:bg-blue-500 h-1 w-0 group-[&.active]:w-full transition-all duration-300 absolute bottom-[-15px]"></div>
          </Link>
          <Link
            to="/cronograma-obrigatorio"
            className="group flex flex-col relative p-0"
          >
            Cronograma obrigatório
            <div className="group-[&.active]:bg-blue-500 h-1 w-0 group-[&.active]:w-full transition-all duration-300 absolute bottom-[-15px]"></div>
          </Link>
          <Link to="/chat" className="group flex flex-col relative p-0">
            Método Socrático
            <div className="group-[&.active]:bg-blue-500 h-1 w-0 group-[&.active]:w-full transition-all duration-300 absolute bottom-[-15px]"></div>
          </Link>
        </nav>

        <div className="flex gap-2 items-center"></div>

        <ModeToggle />
      </div>
      <main className="flex flex-col flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <Toaster />
    </div>
  ),
});
