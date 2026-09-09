import { differenceInCalendarDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatarDataFeed(dateString: string): string {
  // Converte YYYY-MM-DD garantindo o fuso local
  const [year, month, day] = dateString.split('-').map(Number);
  const dataAlvo = new Date(year, month - 1, day);
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasDeDiferenca = differenceInCalendarDays(hoje, dataAlvo);

  if (diasDeDiferenca === 0) return 'Hoje';
  if (diasDeDiferenca === 1) return 'Ontem';
  
  // Se for dentro da mesma semana recente (até 6 dias atrás): "Terça-feira"
  if (diasDeDiferenca < 7) {
    const diaDaSemana = format(dataAlvo, 'EEEE', { locale: ptBR });
    return diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);
  }

  // Se for de semanas passadas: "06/09/2026"
  return format(dataAlvo, 'dd/MM/yyyy');
}

// Exemplos de retorno:
// '2026-09-09' -> "Hoje"
// '2026-09-08' -> "Ontem"
// '2026-09-07' -> "Segunda-feira"
// '2026-08-30' -> "30/08/2026" (Domingo da semana passada)