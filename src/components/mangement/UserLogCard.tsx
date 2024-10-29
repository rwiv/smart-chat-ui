import {css} from "@emotion/react";
import {consts} from "@/configures/consts.ts";
import {ChatUser} from "@/graphql/types.ts";
import {getDateTimeString} from "@/lib/common/date.ts";
import {Button} from "@/components/ui/button.tsx";
import {HStack} from "@/lib/style/layouts.tsx";

interface UserLogCardProps {
  chatUser: ChatUser;
  setCurChatUser: (id: ChatUser | null) => void;
  setIsPrintInfo: (isPrintInfo: boolean) => void;
}

export function UserLogCard({ chatUser, setCurChatUser, setIsPrintInfo }: UserLogCardProps) {
  const createdBy = chatUser.account;

  const onClickChat = () => {
    setIsPrintInfo(false);
    setCurChatUser(chatUser);
  }

  const onClickInfo = () => {
    setIsPrintInfo(true);
    setCurChatUser(chatUser);
  }

  return (
    <div css={css`
      display: flex;
      flex-direction: row;
      margin: 1.3rem;
      padding: 0.5rem 1.2rem;
      border: solid #f0f2f4 0.1rem;
      border-radius: 0.5rem;
      width: 70%;
    `}>
      <div css={css`
        margin-top: 0.6rem;
        margin-right: 0.8rem;
      `}>
        <button>
          {createdBy && (
            <img
              src={`${consts.endpoint}${createdBy.avatarUrl}`}
              css={css`
                border-radius: 20%;
                width: 2.0rem;
                height: 2.0rem;
              `}
              alt="sender-avatar"
            />
          )}
        </button>
      </div>
      <div css={css`
          max-width: 90%;
          overflow-x: auto;
        `}>
        <div>
          {createdBy && (
            <span css={css`
                font-weight: 400;
                font-size: 0.8rem;
                opacity: 0.5;
              `}>
            {createdBy.nickname}
          </span>
          )}
        </div>
        <div css={css`
            font-weight: 400;
            font-size: 0.9rem;
            opacity: 0.8;
          `}>
          {getDateTimeString(chatUser.createdAt)} 접속
        </div>
      </div>

      <HStack css={css`
        margin-left: auto;
        margin-top: 0.4rem;
      `}>
        <Button variant="outline" onClick={onClickChat}>채팅 내역</Button>
        <Button variant="outline" onClick={onClickInfo}>유저 정보</Button>
      </HStack>
    </div>
  )
}
