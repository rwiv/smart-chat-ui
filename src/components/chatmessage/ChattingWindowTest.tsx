import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {useEffect} from "react";
import {ChattingWindow} from "@/components/chatmessage/ChattingWindow.tsx";
import {css} from "@emotion/react";

export function ChattingWindowTest() {

  const {closeStompClient, initStompClient} = useStompStore();
  const {chatRooms} = useSearchedChatRooms();

  useEffect(() => {
    initStompClient();
    return () => {
      closeStompClient();
    }
  }, []);

  return (
    <div>
      {chatRooms.map(chatRoom => (
        <div key={chatRoom.id}>{chatRoom.title}</div>
      ))}
      {chatRooms.length > 0 && (
        <div css={css`
          margin: 1rem;
        `}>
          <ChattingWindow chatRoomId={chatRooms[0].id} />
        </div>
      )}
    </div>
  )
}
