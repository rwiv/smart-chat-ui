import {useParams} from "react-router";
import {mq} from "@/lib/style/mediaQueries.ts";
import {containerStyle, flexStyle} from "@/styles/globalStyles.ts";
import {LeftSidebar} from "@/components/layouts/LeftSidebar.tsx";
import {ChatRoomManagementContent} from "@/components/mangement/ChatRoomManagementContent.tsx";

const left = mq.m_all(2,2,2,2,2,2);
const right = mq.m_all(10,10,10, 10, 10,10);

export function ChatRoomManagementPage() {
  const params = useParams();
  const chatRoomId = getChatRoomId();

  function getChatRoomId() {
    const chatRoomId = params["chatRoomId"];
    if (chatRoomId === undefined) {
      return null;
    }
    return chatRoomId;
  }

  return (
    <div css={containerStyle}>
      <div css={[left, flexStyle]}>
        <LeftSidebar/>
      </div>
      <div css={[right, flexStyle, {background: "#ffffff"}]}>
        {chatRoomId && (
          <ChatRoomManagementContent chatRoomId={chatRoomId}/>
        )}
      </div>
    </div>
  )
}
