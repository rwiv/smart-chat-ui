import {ChatMessage as ChatMessageType} from "@/graphql/types.ts";
import {css} from "@emotion/react";
import {consts} from "@/configures/consts.ts";

interface ChatMessageProps {
  chatMessage: ChatMessageType;
}

export function ChatMessageCard({ chatMessage }: ChatMessageProps) {
  const createdBy = chatMessage.createdBy;

  return (
    <div css={css`
      display: flex;
      flex-direction: row;
      gap: 0.9rem;
      margin: 1.3rem;
    `}>
      <div css={css`
        margin-top: 0.6rem;
        min-width: 9%;
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
          {chatMessage.content}
        </div>
      </div>
    </div>
  )
}
