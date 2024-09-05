import {HStack} from "@/lib/style/layouts.tsx";
import {ChatRoomCreateButton} from "@/components/chatroom/ChatRoomCreateButton.tsx";
import {ChatRoomSidebarList} from "@/components/chatroom/ChatRoomSidebarList.tsx";
import {MyInfo} from "@/components/account/MyInfo.tsx";
import {css} from "@emotion/react";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {useChatRooms} from "@/hooks/chatroom/useChatRooms.ts";
import {rightAlignStyle} from "@/styles/globalStyles.ts";

const frameStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top : 20px;
  padding-bottom: 20px;
  padding-left: 20px;
`;

const labelStyle = css`
  color: white;
  font-size: 20px;
`;

export function ChatRoomSidebar() {

  const {myInfo} = useMyInfo();
  const {
    chatRooms,
    ref,
    addChatRoom,
    // removeChatRoom,
  } = useChatRooms();

  return (
    <>
      <HStack css={frameStyle}>
        <label css={labelStyle}>공개 채팅방 목록</label>
        <div css={rightAlignStyle}>
          <ChatRoomCreateButton addChatRoom={addChatRoom}/>
        </div>
      </HStack>
      <ChatRoomSidebarList myInfo={myInfo} chatRooms={chatRooms} observerRef={ref} />
      <MyInfo />
    </>
  )
}
