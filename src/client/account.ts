import {gql} from "@apollo/client";
import {consts} from "@/configures/consts.ts";
import {AccountAdd} from "@/graphql/types.ts";
import {post} from "@/lib/web/http.ts";

export const accountColumns = gql`
    fragment accountColumns on Account {
        id
        role
        username
        nickname
        avatarUrl
        createdAt
    }
`;

export const myInfoQL = gql`
    query MyInfo {
        account {
            ...accountColumns
            chatRooms {
              id
              title
              createdById
              createdAt
              userCnt
              sharedChatUserId
              createdBy {
                ...accountColumns
              }
            }
        }
    }
    ${accountColumns}
`;

export function signup(creation: AccountAdd) {
  return post(`${consts.endpoint}/api/auth/signup`, creation);
}

export interface LoginRequest {
  username: string;
  password: string;
}

export function login(req: LoginRequest, remember: boolean) {
  let url = `${consts.endpoint}/api/auth/login`;
  if (remember) {
    url += "?remember=true";
  }
  return post(url, req);
}

export function logout() {
  return post(`${consts.endpoint}/api/auth/logout`, null);
}

export const getAccountByUsername = gql`
  query GetAccountByUsername($username: String!) {
      account(username: $username) {
          ...accountColumns
      }
  }
  ${accountColumns}
`;
