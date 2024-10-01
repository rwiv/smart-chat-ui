import {mq} from "@/lib/style/mediaQueries.ts";
import {LeftSidebar} from "@/components/layouts/LeftSidebar.tsx";
import {containerStyle, flexStyle} from "@/styles/globalStyles.ts";
import {useEffect} from "react";
import {useCurChatRoomStore} from "@/hooks/chatroom/useCurChatRoomStore.ts";
import {useSidebarStateStore} from "@/hooks/common/useSidebarStateStore.ts";
import {useParams} from "react-router";

const left = mq.m_all(2,2,2,2,2,2);
const right = mq.m_all(10,10,10, 10, 10,10);

export function IndexPage() {

  const params = useParams();
  const {setCurChatRoom} = useCurChatRoomStore();
  const {setSidebarState} = useSidebarStateStore();

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
        {/*<ChatRoomContent chatRoomId={-1}/>*/}
      </div>
    </div>
  )
}
