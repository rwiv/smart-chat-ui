import {gql} from "@apollo/client";
import {accountColumns} from "@/client/account.ts";

export const defaultChatMessageSize: number = 10;

export const chatMessageColumns = gql`
    fragment chatMessageColumns on ChatMessage {
        id
        content
        createdById
        createdAt
        chatRoomId
        num
    }
`;

export const chatMessagesQL = gql`
    query ChatMessages($chatRoomId: UUID!, $page: Int!, $size: Int!, $offset: Int!) {
        chatMessages(chatRoomId: $chatRoomId, page: $page, size: $size, offset: $offset) {
            ...chatMessageColumns
            createdBy {
                ...accountColumns
            }
        }
    }
    ${chatMessageColumns}
    ${accountColumns}
`;

export const createChatMessageQL = gql`
    mutation CreateChatMessage($req: ChatMessageAdd!) {
        createChatMessage(req: $req) {
            ...chatMessageColumns
            createdBy {
                ...accountColumns
            }
        }
    }
    ${accountColumns}
    ${chatMessageColumns}
`;
