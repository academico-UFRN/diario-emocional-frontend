import type { ChatMessage } from "@/api/chat/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller"

interface ChatScrollerProps {
    mensagens: ChatMessage[];
    isPending?: boolean;
}

export const ChatScroller = ({ mensagens, isPending }: ChatScrollerProps) => {
    return (
        <MessageScrollerProvider>
            <MessageScroller className="mx-auto h-140 w-full flex-1 max-w-4xl gap-0">
                <MessageScrollerViewport>

                    <MessageScrollerContent className="flex-1 overflow-hidden py-4 px-2">
                        {mensagens.map((message) => (
                            <MessageScrollerItem
                                key={message.id}
                                messageId={message.id}
                                scrollAnchor={message.papel === "USER"}
                            >
                                <Message align={message.papel === "USER" ? "end" : "start"} className="animate-in zoom-in-75">
                                    <MessageAvatar>
                                        <Avatar>
                                            {message.papel === "USER" ? (
                                                <>
                                                    <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </>
                                            ) : (
                                                <>
                                                    <AvatarImage src="/logo0.png" alt="AI Avatar" />
                                                    <AvatarFallback>L</AvatarFallback>
                                                </>
                                            )}
                                        </Avatar>
                                    </MessageAvatar>
                                    <MessageContent>
                                        <Bubble variant={message.papel === "USER" ? "default" : "muted"}>
                                            <BubbleContent>{message.conteudo}</BubbleContent>
                                        </Bubble>
                                    </MessageContent>
                                </Message>
                            </MessageScrollerItem>
                        ))}

                        {isPending && (
                            <MessageScrollerItem
                                key="pending"
                                messageId="pending"
                                scrollAnchor={false}
                            >
                                <Message align="start" className="animate-in zoom-in-75">
                                    <MessageAvatar>
                                        <Avatar>
                                            <AvatarImage src="/logo0.png" alt="AI Avatar" />
                                            <AvatarFallback>L</AvatarFallback>
                                        </Avatar>
                                    </MessageAvatar>
                                    <MessageContent>
                                        <Bubble variant="muted" className="animate-pulse ">
                                            <BubbleContent>...</BubbleContent>
                                        </Bubble>
                                    </MessageContent>
                                </Message>
                            </MessageScrollerItem>
                        )}
                    </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
            </MessageScroller>
        </MessageScrollerProvider>
    )
}