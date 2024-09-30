import {ChatRoomSearchSidebar} from "@/components/chatroom/ChatRoomSearchSidebar.tsx";
import {css} from "@emotion/react";
import {Center} from "@/lib/style/layouts.tsx";
import {MdOutlineVideoLibrary} from "react-icons/md";
import {MdOutlineMessage} from "react-icons/md";
import {MdOutlineSearch} from "react-icons/md";
import {mq} from "@/lib/style/mediaQueries.ts";
import {useSidebarStateStore} from "@/hooks/common/useSidebarStateStore.ts";

const navSidebarStyle = css`
    display: flex;
    flex-direction: column;
    background-color: #f9fafb;
`;

const mainSidebarStyle = css`
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
  border: solid #f0f2f4 0.1rem;
  overflow-y: auto;
`;

const left = mq.m_all(2,2,2, 2, 2, 2);
const right = mq.m_all(10,10, 10, 10, 10, 10);

const iconSize = "2.0rem";
const iconColor = "#5a6068";

export function LeftSidebar() {

  const {sidebarState, setSidebarState} = useSidebarStateStore();

  return (
    <>
      <div css={[navSidebarStyle, left]}>
        <button onClick={() => setSidebarState("CHATROOM")}>
          <Center className="mt-5">
            <MdOutlineMessage size={iconSize} color={iconColor}/>
          </Center>
        </button>
        <button onClick={() => setSidebarState("VIDEO")}>
          <Center className="mt-5">
            <MdOutlineVideoLibrary size={iconSize} color={iconColor}/>
          </Center>
        </button>
        <button onClick={() => setSidebarState("SEARCH")}>
          <Center className="mt-5">
            <MdOutlineSearch size={iconSize} color={iconColor}/>
          </Center>
        </button>
      </div>
      <div css={[mainSidebarStyle, right]}>
        {/*{sidebarState === "FRIEND" && <FriendSidebar />}*/}
        {/*{sidebarState === "CHATROOM" && <ParticipatedChatRoomSidebar />}*/}
        {sidebarState === "SEARCH" && <ChatRoomSearchSidebar/>}
      </div>
    </>
  )
}
