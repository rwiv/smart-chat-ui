import {ChatSidebar} from "@/components/chatuser/ChatSidebar.tsx";
import {css} from "@emotion/react";
import {mq} from "@/lib/style/mediaQueries.ts";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {useChatRoomAndUsers} from "@/client/chatUser.ts";
import {RtcMediaContent} from "@/components/webrtc/RtcMediaContent.tsx";

const mainContentStyle = css`
  display: flex;
  flex-direction: column;
  outline: solid #f0f2f4 0.1rem;
`;

const sidebarStyle = css`
  display: flex;
  flex-direction: column;
`;

interface ChatRoomContentProps {
  chatRoomId: string;
}

const left = mq.m_all(12,8,8, 9,9,9);
const right = mq.m_all(0,4,4,3,3,3);

export function ChatRoomContent({ chatRoomId }: ChatRoomContentProps) {

  const {myInfo} = useMyInfo();
  const {data: usersData} = useChatRoomAndUsers(chatRoomId);
  const chatRoom = usersData?.chatRoom ?? undefined;
  const chatUsers = usersData?.chatRoom?.chatUsers ?? undefined;

  return (
    <>
      <div css={[left, mainContentStyle]}>
        {/*<ChatRoomContentHeader />*/}
        {/*{myInfo !== undefined && chatUsers !== undefined && (*/}
        {/*  <ChatMessagesContent chatRoomId={chatRoomId} myInfo={myInfo} chatUsers={chatUsers} />)*/}
        {/*}*/}
        {myInfo && chatRoom && chatUsers && (
          <RtcMediaContent chatRoom={chatRoom} myInfo={myInfo} chatUsers={chatUsers} />)
        }
      </div>
      <div css={[right, sidebarStyle]}>
        {chatUsers !== undefined &&
          (<ChatSidebar chatRoomId={chatRoomId} />)
        }
      </div>
    </>
  )
}
