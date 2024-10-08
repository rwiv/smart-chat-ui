import {useChatMessagesScroll} from "@/hooks/chatmessage/useChatMessagesScroll.ts";
import {useChatMessagesStomp} from "@/hooks/chatmessage/useChatMessagesStomp.ts";

export function useChatMessages(chatRoomId: string) {

  const {
    chatMessages, setChatMessages,
    page, loading,
    scrollRef, observerRef,
    setOffset, setScrollType
  } = useChatMessagesScroll(chatRoomId);

  const {existsMsgSub} = useChatMessagesStomp(chatRoomId, setChatMessages, setOffset, setScrollType);

  return { chatMessages, page, observerRef, scrollRef, loading, existsMsgSub };
}
