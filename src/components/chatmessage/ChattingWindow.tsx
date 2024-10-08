import {ChatMessageList} from "@/components/chatmessage/ChatMessageList.tsx";
import {useChatMessages} from "@/hooks/chatmessage/useChatMessages.ts";
import {ChatMessageInput} from "@/components/chatmessage/ChatMessageInput.tsx";
import {css} from "@emotion/react";

interface ChatMessagesContentProps {
  chatRoomId: string;
}

export function ChattingWindow({ chatRoomId }: ChatMessagesContentProps) {

  const {
    chatMessages,
    observerRef,
    scrollRef,
  } = useChatMessages(chatRoomId);

  return (
    <div css={css`
      outline: solid #f0f2f4 0.1rem;
      border-radius: 10px;
      height: 100%;
    `}>
      <div css={css`
        height: 87%;
      `}>
        <ChatMessageList
          chatMessages={chatMessages}
          scrollRef={scrollRef}
          observerRef={observerRef}
        />
      </div>
      <div css={css`
          margin: 2rem;
        `}>
        <ChatMessageInput
          chatRoomId={chatRoomId}
        />
      </div>
    </div>
  )
}
