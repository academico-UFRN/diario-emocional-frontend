import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // Mantém dados frescos por 5 minutos
			retry: 1, // Tenta apenas mais 1 vez em caso de falha
			refetchOnWindowFocus: false,
		},
	},
});
