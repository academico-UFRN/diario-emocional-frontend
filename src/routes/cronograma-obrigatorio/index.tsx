import { createFileRoute, Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusIcon } from "@hugeicons/core-free-icons";
import { Heading } from "@/components/-/typography";
import { buttonVariants } from "@/components/ui/button";
import { TableCronogramaObrigatorio } from "./-components/table-cronograma-obrigatorio";

export const Route = createFileRoute("/cronograma-obrigatorio/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto flex max-w-270 flex-col gap-8 p-4">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Heading as="h1" variant="h1">
            Cronograma Obrigatório
          </Heading>

          <Link
            to="/cronograma-obrigatorio/criar"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <HugeiconsIcon icon={PlusIcon} strokeWidth={2} />
            Adicionar Atividade
          </Link>
        </div>

        <p>
          Organize as atividades fixas da semana e acompanhe seus horários
          obrigatórios.
        </p>
      </header>

      <TableCronogramaObrigatorio />
    </main>
  );
}
