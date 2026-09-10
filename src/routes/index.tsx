// src/routes/index.tsx

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 h-60">
			<h1 className="text-2xl font-bold">Tela em desenvolvimento</h1>
			<p className="text-sm text-muted-foreground">Essa tela sera um hub para os diferentes módulos do diário emocional.</p>
		</div>
	);
}
