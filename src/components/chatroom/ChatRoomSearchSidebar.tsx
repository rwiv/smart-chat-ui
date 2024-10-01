import {ReactNode} from "react";
import {Link} from "react-router-dom";
import {HStack} from "@/lib/style/layouts.tsx";
import {ChatRoomCreateButton} from "@/components/chatroom/ChatRoomCreateButton.tsx";
import {ChatRoomSidebarList} from "@/components/chatroom/ChatRoomSidebarList.tsx";
import {MyInfo} from "@/components/account/MyInfo.tsx";
import {css} from "@emotion/react";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {rightAlignStyle} from "@/styles/globalStyles.ts";
import {SIDEBAR_FONT} from "@/styles/colors.ts";

const frameStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top : 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.5rem;
`;

const labelStyle = css`
  color: ${SIDEBAR_FONT};
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

      <div className="mt-1" />
      <Link to={"/chat-rooms"}>
        <SidebarButton>채팅방</SidebarButton>
      </Link>
      <Link to={"/"}>
        <SidebarButton>다시보기</SidebarButton>
      </Link>

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

export function SidebarButton({children}: { children: ReactNode }) {
  return (
    <div className="rounded-sm px-1 py-2" css={css`
      color: ${SIDEBAR_FONT};
      margin: 0.2rem 0.3rem;
      padding: 0.5rem;
      font-weight: 500;
      font-size: 1.1rem;
      cursor: pointer;

      &:hover {
        background: #f3f5f7;
      }
    `}>
      {children}
    </div>
  )
}
