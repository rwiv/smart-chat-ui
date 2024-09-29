import {gql, useMutation} from "@apollo/client";
import {useQuery} from "@/lib/web/apollo.ts";
import {Mutation} from "@/graphql/types.ts";

export const myFriendsQL = gql`
`;

export function useMyFriends() {
  return useQuery(myFriendsQL);
}

const createChatRoomByFriendQL = gql`
`;

export function useCreateChatRoomByFriend() {
  const [createChatRoomByFriend, {loading, error}] = useMutation<Mutation>(createChatRoomByFriendQL);
  return {createChatRoomByFriend, loading, error};
}

const addFriendQL = gql`
`;

export function useAddFriend() {
  const [addFriend, {loading, error}] = useMutation<Mutation>(addFriendQL);
  return {addFriend, loading, error};
}
