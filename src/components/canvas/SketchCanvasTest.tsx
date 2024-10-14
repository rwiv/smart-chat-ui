import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {useEffect} from "react";
import {css} from "@emotion/react";
import {SketchCanvas} from "@/components/canvas/SketchCanvas.tsx";

export function SketchCanvasTest() {

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
          <SketchCanvas chatRoomId={chatRooms[0].id} isRemote={false} width="32rem" height="18rem">
            <video css={css`
              width: 32rem;
              height: 18rem;
            `}>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm " type="video/mp4"/>
            </video>
          </SketchCanvas>
          <SketchCanvas chatRoomId={chatRooms[0].id} isRemote={true} width="32rem" height="18rem">
            <video css={css`
              width: 32rem;
              height: 18rem;
            `}>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm " type="video/mp4"/>
            </video>
          </SketchCanvas>
        </div>
      )}
    </div>
  )
}
