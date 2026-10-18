export interface SugestaoSaudeMental {
	acao: string;
	motivo: string;
	[key: string]: unknown;
}

export interface SolicitacaoSaudeMental {
	id?: number;
	dataRegistro: string;
	sugestoes: SugestaoSaudeMental[];
}