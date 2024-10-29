import {css} from "@emotion/react";
import {mq} from "@/lib/style/mediaQueries.ts";
import {ChatHistoryWindow} from "@/components/mangement/ChattingWindowMangement.tsx";
import {Center, HStack} from "@/lib/style/layouts.tsx";
import {useChatRoomAndUsers} from "@/client/chatUser.ts";
import {ChatMessage, ChatUser} from "@/graphql/types.ts";
import {UserLogCard} from "@/components/mangement/UserLogCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {consts} from "@/configures/consts.ts";
import {getDateString, getDateTimeString} from "@/lib/common/date.ts";

const mainContentStyle = css`
  display: flex;
  flex-direction: column;
`;

const sidebarStyle = css`
  display: flex;
  flex-direction: column;
`;

interface ChatRoomContentProps {
  chatRoomId: string;
}

const left = mq.m_all(12,8,8, 8,8,9);
const right = mq.m_all(0,4,4,4,4,3);

export function ChatRoomManagementContent({ chatRoomId }: ChatRoomContentProps) {

  const {data: usersData} = useChatRoomAndUsers(chatRoomId);
  const chatRoom = usersData?.chatRoom ?? undefined;
  const chatUsers = usersData?.chatRoom?.chatUsers ?? undefined;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [curChatUser, setCurChatUserState] = useState<ChatUser | null>(null);
  const [isPrintInfo, setIsPrintInfo] = useState(false);

  const setCurChatUser = (chatUser: ChatUser | null) => {
    setCurChatUserState(chatUser);
    setChatMessages(chatUser?.chatMessages ?? []);
  }

  const onClickAllChat = () => {
    const chatMessages = chatRoom?.chatMessages;
    if (chatMessages) {
      setIsPrintInfo(false);
      setChatMessages(chatMessages);
    }
  }

  return (
    <>
      <div css={[left, mainContentStyle]}>
        <div css={css`
          margin: 0.1rem 1rem;
        `}>
          <HStack css={css`
            margin: 1rem 2rem;
            gap: 2rem;
          `}>
            <div css={css`
              font-weight: 600;
              font-size: 1.4rem;
            `}>{chatRoom?.title}</div>
            <Button onClick={onClickAllChat} css={css`
              background: #007eff;
              width: 5.5rem;
              height: 2.3rem;
              font-size: 0.9rem;
            `}>전체 채팅</Button>
          </HStack>
          {chatUsers && (
            <div>
              {chatUsers.map((chatUser) => (
                <UserLogCard
                  key={chatUser.id}
                  chatUser={chatUser}
                  setCurChatUser={setCurChatUser}
                  setIsPrintInfo={setIsPrintInfo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div css={[right, sidebarStyle]}>
        <div css={css`
          margin: 5rem 1rem 2rem 0.1rem;
          height: 100vh;
        `}>
          {isPrintInfo ? (
            curChatUser && (
              <UserInfo chatUser={curChatUser}/>
            )
          ) : (
            <ChatHistoryWindow chatMessages={chatMessages}/>
          )}
        </div>
      </div>
    </>
  )
}

interface UserInfoProps {
  chatUser: ChatUser;
}

const columnStyle = css`
  margin: 1.2rem 1rem;
`;

const keyStyle = css`
  font-weight: 400;
  font-size: 0.9rem;
  opacity: 0.5;
`;

const valueStyle = css`
  font-weight: 400;
  font-size: 0.9rem;
  opacity: 0.8;
`;

function UserInfo({chatUser}: UserInfoProps) {

  const account = chatUser.account;

  return (
    <div css={css`
      outline: solid #f0f2f4 0.1rem;
      border-radius: 10px;
      height: 100%;
      padding: 1rem 1rem;
    `}>
      <div>
        <Center css={css`margin-top: 0.7rem;`}>
          <img
            css={css`
              border-radius: 20%;
              width: 5.0rem;
              height: 5.0rem;
            `}
            src={`${consts.endpoint}${chatUser.account.avatarUrl}`}
            alt="sender-avatar"
          />
        </Center>
        <div css={columnStyle}>
          <div css={keyStyle}>이메일</div>
          <div css={valueStyle}>{account.username}</div>
        </div>
        <div css={columnStyle}>
          <div css={keyStyle}>닉네임</div>
          <div css={valueStyle}>{account.nickname}</div>
        </div>
        <div css={columnStyle}>
          <div css={keyStyle}>가입일</div>
          <div css={valueStyle}>{getDateString(account.createdAt)}</div>
        </div>
        <div css={columnStyle}>
          <div css={keyStyle}>입장 시간</div>
          <div css={valueStyle}>{getDateTimeString(chatUser.createdAt)}</div>
        </div>
      </div>
    </div>
  )
}
