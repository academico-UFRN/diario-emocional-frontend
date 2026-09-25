export interface ChatMessage {
    id: string;
    papel: "USER" | "IA";
    criadoEm: string;
    conteudo: string;
}

export interface ChatResponse {
    id: string;
    titulo: string;
    mensagens: ChatMessage[];
    modelo: string;
}

export interface ChatRequest {
    mensagem: string;
}

export interface ChatResumoResponse {
    id: string;
    titulo: string;
}

