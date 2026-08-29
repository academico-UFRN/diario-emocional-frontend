// src/routes/index.tsx

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Meu Diário Emocional</h1>
			<Button>Teste de button SHADCN UI</Button>
		</div>
	);
}
