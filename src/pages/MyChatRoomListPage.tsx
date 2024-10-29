import {mq} from "@/lib/style/mediaQueries.ts";
import {containerStyle, flexStyle} from "@/styles/globalStyles.ts";
import {LeftSidebar} from "@/components/layouts/LeftSidebar.tsx";
import {HStack} from "@/lib/style/layouts.tsx";
import {css} from "@emotion/react";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {MyChatRoomTable} from "@/components/mangement/MyChatRoomTable.tsx";

const left = mq.m_all(2,2,2,2,2,2);
const right = mq.m_all(10,10,10, 10, 10,10);

export function MyChatRoomListPage() {

  const {myInfo} = useMyInfo();
  const myChatRooms = myInfo?.chatRooms;

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
            `}>내 채팅방 목록</div>
          </HStack>
          {myChatRooms && (
            <MyChatRoomTable chatRooms={myChatRooms}/>
          )}
        </div>
      </div>
    </div>
  )
}
