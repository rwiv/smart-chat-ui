import {useParams} from "react-router";
import {useEffect} from "react";
import {mq} from "@/lib/style/mediaQueries.ts";
import {LeftSidebar} from "@/components/layouts/LeftSidebar.tsx";
import {containerStyle, flexStyle} from "@/styles/globalStyles.ts";
import {useCurChatRoomStore} from "@/hooks/chatroom/useCurChatRoomStore.ts";
import {ChatRoomContent} from "@/components/layouts/ChatRoomContent.tsx";

const left = mq.m_all(2,2,2,2,2,2);
const right = mq.m_all(10,10,10, 10, 10,10);

export function ChatRoomPage() {

  const params = useParams();
  const chatRoomId = getChatRoomId();

  // const {refresh} = useChatMessagesRefreshStore();
  const {setCurChatRoomId} = useCurChatRoomStore();

  function getChatRoomId() {
    const chatRoomId = params["chatRoomId"];
    if (chatRoomId === undefined) {
      return null;
    }
    return chatRoomId;
  }

  useEffect(() => {
    setCurChatRoomId(chatRoomId)
    // refresh();
  }, [params]);

  return (
    <div css={containerStyle}>
      <div css={[left, flexStyle]}>
        <LeftSidebar/>
      </div>
      <div css={[right, flexStyle, {background: "#ffffff"}]}>
        {chatRoomId !== null && (
          <ChatRoomContent chatRoomId={chatRoomId}/>
        )}
      </div>
    </div>
  )
}
