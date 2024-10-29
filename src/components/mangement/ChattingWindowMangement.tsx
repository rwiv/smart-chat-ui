import {frameStyle, SCROLL_RATIO} from "@/components/chatmessage/ChatMessageList.tsx";
import {css} from "@emotion/react";
import {ChatMessageCard} from "@/components/chatmessage/ChatMessageCard.tsx";
import {ChatMessage} from "@/graphql/types.ts";

interface ChatMessagesContentProps {
  chatMessages: ChatMessage[];
}

export function ChatHistoryWindow({ chatMessages }: ChatMessagesContentProps) {

  return (
    <div css={css`
      outline: solid #f0f2f4 0.1rem;
      border-radius: 10px;
      height: 100%;
    `}>
      <div css={css`
        height: 87%;
      `}>
        <div
          className="overflow-y-auto"
          css={[frameStyle, {height: window.innerHeight * SCROLL_RATIO}]}
        >
          {chatMessages?.map(chatMessage => (
            <ChatMessageCard key={chatMessage.id} chatMessage={chatMessage}/>
          ))}
        </div>
      </div>
    </div>
  )
}
