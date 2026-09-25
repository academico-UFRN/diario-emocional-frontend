import type React from "react";
import { useEffect, useState } from "react";
import type { ChatMessage } from "@/api/chat/schema";

interface MessageAnimatedProps {
    message: ChatMessage;
    scrollAnchor?: boolean;
    charsPerSecond?: number;
    animate?: boolean;
    onAnimationComplete?: () => void;
    onTextUpdate?: () => void;
}

export const MessageAnimated: React.FC<MessageAnimatedProps> = ({
    message,
    scrollAnchor = false,
    charsPerSecond = 80,
    animate = false,
    onAnimationComplete,
    onTextUpdate,
}) => {
    const textContent = message.conteudo;
    const isUserMessage = message.papel === "USER";

    // Se NÃO for para animar ou se for mensagem do usuário, exibe o texto completo imediatamente
    const [displayedText, setDisplayedText] = useState(() => {
        if (!animate || isUserMessage) {
            return textContent;
        }
        return "";
    });
    const [isComplete, setIsComplete] = useState(() => !animate || isUserMessage);

    useEffect(() => {
        // Se não deve animar ou se é mensagem do usuário, garante o texto completo
        if (!animate || isUserMessage) {
            setDisplayedText(textContent);
            setIsComplete(true);
            return;
        }

        // Para mensagens da IA que devem ser animadas (novas mensagens):
        setDisplayedText("");
        setIsComplete(false);

        // Atualiza a cada 30ms adicionando pequenos blocos de caracteres
        // Isso mantém a taxa de atualização suave e libera a thread do navegador para rolagem fluida
        const stepMs = 30;
        const charsPerStep = Math.max(1, Math.round((charsPerSecond * stepMs) / 1000));
        let currentChar = 0;

        const interval = setInterval(() => {
            if (currentChar < textContent.length) {
                currentChar = Math.min(currentChar + charsPerStep, textContent.length);
                setDisplayedText(textContent.slice(0, currentChar));
                onTextUpdate?.();
            } else {
                setIsComplete(true);
                clearInterval(interval);
                onAnimationComplete?.();
            }
        }, stepMs);

        return () => clearInterval(interval);
    }, [textContent, isUserMessage, animate, charsPerSecond, onAnimationComplete, onTextUpdate]);

    return (
        <div
            data-message-id={message.id}
            data-scroll-anchor={scrollAnchor ? "true" : "false"}
            className={`flex mb-4 ${isUserMessage ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`px-4 py-2.5 rounded-2xl ${isUserMessage
                    ? "bg-muted text-foreground rounded-br-none max-w-lg"
                    : "bg-transparent text-foreground rounded-bl-none w-full"
                    }`}
            >
                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                    {displayedText}
                    {!isComplete && <span className="animate-pulse ml-0.5 inline-block">▌</span>}
                </p>
            </div>
        </div>
    );
};
