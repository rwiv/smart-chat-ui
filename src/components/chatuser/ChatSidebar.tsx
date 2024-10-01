import {css} from "@emotion/react";
import {HStack} from "@/lib/style/layouts.tsx";
import {rightAlignStyle} from "@/styles/globalStyles.ts";

const headerStyle = css`
`;

const nameStyle = css`
  font-size: 1.4rem;
  font-weight: 600;
  margin-left: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: 'Noto Sans KR'
`;

interface ChatUserSidebarProps {
  chatRoomId: string
}

export function ChatSidebar({ chatRoomId }: ChatUserSidebarProps) {

  return (
    <div>
      <div css={headerStyle}>
        <HStack>
          <label css={nameStyle}>채팅</label>
          <div>{chatRoomId}</div>
          <div css={rightAlignStyle}>
            {/*<InviteChatUserButton chatUsers={chatUsers} />*/}
          </div>
        </HStack>
      </div>
      {/*{myInfo && (*/}
      {/*  <ChatUserSidebarList chatUsers={chatUsers} myInfo={myInfo} />*/}
      {/*)}*/}
    </div>
  )
}
