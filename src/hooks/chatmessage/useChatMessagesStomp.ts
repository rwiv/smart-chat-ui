import React, {useEffect} from "react";
import {IMessage} from "@stomp/stompjs";
import {ChatMessage, Mutation, Query} from "@/graphql/types.ts";
import {chatMessageQL, createChatMessageQL} from "@/client/chatMessage.ts";
import {useApolloClient} from "@apollo/client";
import {ScrollType} from "@/hooks/chatmessage/useChatMessagesScroll.ts";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";

export function useChatMessagesStomp(
  chatRoomId: string,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  setScrollType: React.Dispatch<React.SetStateAction<ScrollType>>,
) {

  const apolloClient = useApolloClient();
  const {stompClient, isConnected} = useStompStore();

  useEffect(() => {
    if (stompClient && isConnected && stompClient.isRestored()) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRoomId}/messages`, onMessage);
    }
  }, [stompClient, isConnected]);

  async function onMessage(msg: IMessage) {
    const body = JSON.parse(msg.body) as { id: string, num: number };
    const res = await apolloClient.query<Query>({
      query: chatMessageQL, variables: { id: body.id }, fetchPolicy: "network-only",
    });
    const chatMessage = res.data.chatMessage;
    if (chatMessage === undefined || chatMessage === null) return;

    setChatMessages(prev => {
      if (prev.find(it => it.id === body.id) !== undefined) {
        return prev;
      }
      return [...prev, chatMessage];
    });
    setOffset(prev => prev + 1);
    setScrollType("BOTTOM");
  }

  const send = async (message: string) => {
    const res = await apolloClient.query<Mutation>({
      query: createChatMessageQL,
      variables: {
        content: message,
        chatRoomId: chatRoomId,
      },
      fetchPolicy: "no-cache",
    });
    const chatMessage = res.data.createChatMessage;
    setChatMessages(prev => [...prev, chatMessage]);
  }

  return {send};
}
