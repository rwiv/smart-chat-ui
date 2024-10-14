import React, {useEffect, useState} from "react";
import {IMessage} from "@stomp/stompjs";
import {ChatMessage} from "@/graphql/types.ts";
import {ScrollType} from "@/hooks/chatmessage/useChatMessagesScroll.ts";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";

export function useChatMessagesStomp(
  chatRoomId: string,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  setScrollType: React.Dispatch<React.SetStateAction<ScrollType>>,
) {

  const {stompClient, isConnected} = useStompStore();
  const [existsMsgSub, setExistsMsgSub] = useState(false);

  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRoomId}/messages`, onMessage);
      setExistsMsgSub(true);
    }
  }, [stompClient, isConnected]);

  async function onMessage(msg: IMessage) {
    const chatMessage = JSON.parse(msg.body) as ChatMessage;
    if (!chatMessage) return;

    setChatMessages(prev => {
      if (prev.find(it => it.id === chatMessage.id)) {
        return prev;
      } else {
        return [...prev, chatMessage];
      }
    });
    setOffset(prev => prev + 1);
    setScrollType("BOTTOM");
  }

  return {existsMsgSub};
}
