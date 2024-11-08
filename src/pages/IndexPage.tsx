import {mq} from "@/lib/style/mediaQueries.ts";
import {LeftSidebar} from "@/components/layouts/LeftSidebar.tsx";
import {containerStyle, flexStyle} from "@/styles/globalStyles.ts";
import {useEffect} from "react";
import {useCurChatRoomStore} from "@/hooks/chatroom/useCurChatRoomStore.ts";
import {useSidebarStateStore} from "@/hooks/common/useSidebarStateStore.ts";
import {useParams} from "react-router";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {css} from "@emotion/react";
import {HStack} from "@/lib/style/layouts.tsx";
import {ChatRoomCreateButton} from "@/components/chatroom/ChatRoomCreateButton.tsx";
import {ChatRoomTable} from "@/components/chatroom/ChatRoomTable.tsx";

const left = mq.m_all(2,2,2,2,2,2);
const right = mq.m_all(10,10,10, 10, 10,10);

export function IndexPage() {

  const params = useParams();
  const {setCurChatRoom} = useCurChatRoomStore();
  const {setSidebarState} = useSidebarStateStore();
  const {chatRooms, addChatRoom} = useSearchedChatRooms();

  useEffect(() => {
    setCurChatRoom(null);
    // setSidebarState("CHATROOM");
    setSidebarState("SEARCH");
  }, [params]);

  return (
    <div css={containerStyle}>
      <div css={[left, flexStyle]}>
        <LeftSidebar/>
      </div>
      <div css={[right, flexStyle, {background: "#ffffff"}]}>
        <div css={css`
          margin: 1rem 3rem;
          width: 100%;
        `}>
          <HStack className="mb-4 ml-1 mr-5" css={{justifyContent: "space-between"}}>
            <div css={css`
              font-weight: 600;
              font-size: 1.4rem;
            `}>채팅방 목록</div>
            <div>
              <ChatRoomCreateButton addChatRoom={addChatRoom}/>
            </div>
          </HStack>
          <ChatRoomTable chatRooms={chatRooms}/>
        </div>
      </div>
    </div>
  )
}
