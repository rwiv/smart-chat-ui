import {HStack} from "@/lib/style/layouts.tsx";
import {ChatRoomCreateButton} from "@/components/chatroom/ChatRoomCreateButton.tsx";
import {ChatRoomSidebarList} from "@/components/chatroom/ChatRoomSidebarList.tsx";
import {MyInfo} from "@/components/account/MyInfo.tsx";
import {css} from "@emotion/react";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {rightAlignStyle} from "@/styles/globalStyles.ts";

const frameStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top : 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.5rem;
`;

const labelStyle = css`
  color: #5a6068;
  font-size: 20px;
`;

export function ChatRoomSearchSidebar() {

  const {myInfo} = useMyInfo();
  const {
    chatRooms,
    ref,
    addChatRoom,
    // removeChatRoom,
  } = useSearchedChatRooms();

  return (
    <>
      <MyInfo />
      <HStack css={frameStyle}>
        <label css={labelStyle}>채팅방 목록</label>
        <div css={rightAlignStyle}>
          <ChatRoomCreateButton addChatRoom={addChatRoom}/>
        </div>
      </HStack>
      <ChatRoomSidebarList myInfo={myInfo} chatRooms={chatRooms} observerRef={ref} />
    </>
  )
}
