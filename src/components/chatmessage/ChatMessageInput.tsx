import {css} from "@emotion/react";
import {useApolloClient} from "@apollo/client";
import React, {useState} from "react";
import {Mutation} from "@/graphql/types.ts";
import {createChatMessageQL} from "@/client/chatMessage.ts";
import {Input} from "@/components/ui/input.tsx";

interface ChatMessageInputProps {
  chatRoomId: string;
}

export function ChatMessageInput({ chatRoomId }: ChatMessageInputProps) {

  const apolloClient = useApolloClient();
  const [input, setInput] = useState("");

  const send = async (message: string) => {
    await apolloClient.query<Mutation>({
      query: createChatMessageQL,
      variables: { req: { content: message, chatRoomId } },
      fetchPolicy: "no-cache",
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      send(input).then(() => {
        setInput("");
      });
    }
  };

  return (
    <Input
      css={css`
        border: solid #f0f2f4 0.1rem;
        border-radius: 15px;
        font-weight: 400;
        font-size: 0.9rem;
        opacity: 0.8;
        height: 2.5rem;
      `}
      type="message"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
