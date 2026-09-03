import { Heading } from '@/components/others/typography';
import { createFileRoute } from '@tanstack/react-router'
import { Delete, Edit } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { ListarRelatosDia } from '@/api/relato-dia/relato-dia.service';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

export const Route = createFileRoute('/relatoDia/')({
  component: RouteComponent,
})

function RouteComponent() {
	const { data } = useQuery({
		queryKey: ["relatoDia", 1],
		queryFn: () => ListarRelatosDia(1),
	});
console.log(data);
  return(
  		<main className="flex flex-col gap-8 p-4 max-w-270 mx-auto">
			<header className="flex flex-col gap-4">
				<Heading as="h1" variant="h1">
					Relato do dia
				</Heading>
                
                <p>
					Aqui você pode editar, deletar e acompanhar seus relatos diários ao longo
					do tempo.
				</p>

			</header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{
            data?.map((relato) => (
                <Card key={relato.dataRegistro} className="p-4">
                    <CardHeader>
                        <CardTitle>{relato.dataRegistro}</CardTitle>
                        <CardTitle>{relato.titulo}</CardTitle>
                    </CardHeader>

                    <CardFooter className="flex justify-end gap-2">
						<Button variant="outline" className="">
							<HugeiconsIcon icon={Edit} strokeWidth={2} />
							Editar Avaliação
						</Button>
						<Button variant="destructive" className="">
							<HugeiconsIcon icon={Delete} strokeWidth={2} />
							Deletar Avaliação
						</Button>
					</CardFooter>
                </Card>
            ))}
            </div>
        </main>
)
}
