import {gql, useMutation} from "@apollo/client";
import {Mutation} from "@/graphql/types.ts";
import {chatRoomColumns} from "@/client/chatRoom.ts";
import {accountColumns} from "@/client/account.ts";
import {useQuery} from "@/lib/web/apollo.ts";

export const chatUserColumns = gql`
    fragment chatUserColumns on ChatUser {
        id
        chatRoom {
            id
        }
        account {
            id
        }
        createdAt
    }
`;

export function chatRoomAndUsersByIdQL(id: number) {
    return gql`
        query ChatRoomAndUsersById {
            chatRoom(id: ${id}) {
                ...chatRoomColumns
                chatUsers {
                    ...chatUserColumns
                    account {
                        ...accountColumns
                    }
                }
            }
        }
        ${accountColumns}
        ${chatRoomColumns}
        ${chatUserColumns}
    `;
}

export function useChatRoomAndUsers(chatRoomId: number) {
    return useQuery(chatRoomAndUsersByIdQL(chatRoomId));
}

export const myChatUsersQL = gql`
    query MyChatUsers {
        account {
            ...accountColumns
            chatUsers {
                ...chatUserColumns
                chatRoom {
                    ...chatRoomColumns
                }
            }
        }
    }
    ${accountColumns}
    ${chatRoomColumns}
    ${chatUserColumns}
`;

export function useMyChatUsers() {
    return useQuery(myChatUsersQL);
}

const createChatUserQL = gql`
    mutation CreateChatUser($chatRoomId: Long!, $password: String) {
        createChatUser(chatRoomId: $chatRoomId, password: $password) {
            ...chatUserColumns
        }
    }
    ${chatUserColumns}
`;

export function useCreateChatUser() {
  const [createChatUser, {loading, error}] = useMutation<Mutation>(createChatUserQL);
  return {createChatUser, loading, error};
}


const createChatUserFromParticipantQL = gql`
    mutation CreateChatUserFromParticipant($chatRoomId: Long!, $accountId: Long!) {
        createChatUserFromParticipant(chatRoomId: $chatRoomId, accountId: $accountId) {
            ...chatUserColumns
        }
    }
    ${chatUserColumns}
`;

export function useCreateChatUserFromParticipant() {
    const [createChatUserFromParticipant, {loading, error}] = useMutation<Mutation>(createChatUserFromParticipantQL);
    return {createChatUserFromParticipant, loading, error};
}

const deleteChatUserMeQL = gql`
    mutation DeleteChatUserMe($chatRoomId: Long!) {
        deleteChatUserMe(chatRoomId: $chatRoomId) {
            ...chatUserColumns
        }
    }
    ${chatUserColumns}
`;

export function useDeleteChatUserMe() {
    const [deleteChatUserMe, {loading, error}] = useMutation<Mutation>(deleteChatUserMeQL);
    return {deleteChatUserMe, loading, error};
}
