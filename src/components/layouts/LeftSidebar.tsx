import {css} from "@emotion/react";
import {Link} from "react-router-dom";
import {MyInfo} from "@/components/account/MyInfo.tsx";
import {ReactNode} from "react";
import {SIDEBAR_FONT} from "@/styles/colors.ts";

const mainSidebarStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #f9fafb;
  border: solid #f0f2f4 0.1rem;
  overflow-y: auto;
`;

export function LeftSidebar() {

  return (
    <div css={mainSidebarStyle}>
      <MyInfo />

      <div className="mt-1" />
      <Link to={"/"}>
        <SidebarButton>채팅방 리스트</SidebarButton>
      </Link>
      <Link to={"/my-chat-rooms"}>
        <SidebarButton>내 채팅방 관리</SidebarButton>
      </Link>
    </div>
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
