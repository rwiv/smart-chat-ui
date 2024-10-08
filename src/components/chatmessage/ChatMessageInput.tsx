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
        border-radius: 20px;
        font-size: 1.1rem;
        height: 3rem;
      `}
      type="message"
      value={input}
      onChange={e => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
