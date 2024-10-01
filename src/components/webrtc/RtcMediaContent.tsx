import {useEffect, useState} from "react";
import {Account, ChatRoom, ChatUser, Mutation} from "@/graphql/types.ts";
import {useRtcConnections} from "@/hooks/websocket/useRtcConnections.ts";
import {useConnMapStore} from "@/hooks/webrtc/useConnMapStore.ts";
import {useMediaStreamStore} from "@/hooks/webrtc/useMediaStreamStore.ts";
import {RtcVideo} from "@/components/webrtc/RtcVideo.tsx";
import {HStack, VStack} from "@/lib/style/layouts.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useApolloClient} from "@apollo/client";
import {updateSharedChatUserQL} from "@/client/chatRoom.ts";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {Container} from "@/lib/common/container.ts";
import {buttonStyle} from "@/styles/buttonStyles.ts";
import {css} from "@emotion/react";

interface ChatMessagesContentProps {
  chatRoom: ChatRoom;
  myInfo: Account;
  chatUsers: ChatUser[];
}

export function RtcMediaContent({ chatRoom, myInfo, chatUsers }: ChatMessagesContentProps) {

  const {connMap} = useConnMapStore();
  const {localStream, setLocalStream} = useMediaStreamStore();
  const {stompClient, isConnected} = useStompStore();
  const apolloClient = useApolloClient();
  const {connect, disconnect} = useRtcConnections(chatRoom.id, myInfo, chatUsers);
  const [sharedId, setSharedId] = useState<string | undefined>(chatRoom.sharedChatUserId ?? undefined);

  const findSharedUser = (): ChatUser => {
    const chatUser = chatUsers.find(it => it.id === sharedId);
    if (!chatUser) {
      throw new Error("chatUser is not found");
    }
    return chatUser;
  }

  const findSharedAccountAndStream = (): [Account, MediaStream | undefined] => {
    // find ChatUser
    const chatUser = findSharedUser();

    // find MediaStream
    let mediaStream: MediaStream | undefined = undefined;
    if (chatUser.account.id === myInfo.id) {
      mediaStream = localStream;
    }
    const remoteStream = connMap.get(chatUser.id)?.remoteStream;
    if (remoteStream) {
      mediaStream = remoteStream;
    }

    return [chatUser.account, mediaStream];
  }

  useEffect(() => {
    init();
    return () => {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (localStream) {
      connect();
    }
  }, [localStream]);

  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRoom.id}/shared`, (msg) => {
        const chatRoom = JSON.parse(msg.body) as ChatRoom;
        setSharedId(chatRoom.sharedChatUserId ?? undefined);
      });
    }
  }, [stompClient, isConnected]);

  const init = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
  }

  const onStartShare = async () => {
    const res = await apolloClient.query<Mutation>({
      query: updateSharedChatUserQL, variables: { chatRoomId: chatRoom.id }, fetchPolicy: "no-cache",
    });
    const sharedId = res.data?.updateSharedChatUser?.sharedChatUserId
    if (!sharedId) {
      throw new Error("sharedId is not found");
    }
  }

  const onCloseShare = async () => {
    const res = await apolloClient.query<Mutation>({
      query: updateSharedChatUserQL, variables: { chatRoomId: chatRoom.id, isClose: true }, fetchPolicy: "no-cache",
    });
    const sharedId = res.data?.updateSharedChatUser?.sharedChatUserId
    console.log(sharedId);
  }

  return (
    <VStack css={{margin: "0.5rem 1rem"}}>
      <HStack className="mt-3 mb-3 ml-4 mr-5" css={{justifyContent: "space-between"}}>
        <div css={css`
            font-weight: 600;
            font-size: 1.4rem;
          `}>{chatRoom.title}</div>
        <div>
          {sharedId && findSharedUser().account.id === myInfo.id && (
            <Button css={buttonStyle} onClick={onCloseShare}>공유 종료</Button>
          )}
          {sharedId === undefined && (
            <Button css={buttonStyle} onClick={onStartShare}>화면 공유</Button>
          )}
        </div>
      </HStack>
      {sharedId ? (
        <VStack>
          <HStack>
            {localStream && (
              <RtcVideo mediaStream={localStream} account={myInfo} type={"SHARED_SUB"} />
            )}
            {connMap.values().map(it => (
              <RtcVideo key={it.target.id} mediaStream={it.remoteStream} account={it.target.account} type={"SHARED_SUB"} />
            ))}
          </HStack>
          <div>
            {new Container(findSharedAccountAndStream()).map(([account, mediaStream]) => {
              if (!mediaStream) return null;
              return (<RtcVideo mediaStream={mediaStream} account={account} type={"SHARED_MAIN"}/>)
            })}
          </div>
        </VStack>
      ) : (
        <HStack>
          {localStream && (
            <RtcVideo mediaStream={localStream} account={myInfo} type={"DEFAULT"} />
          )}
          {connMap.values().map(it => (
            <RtcVideo key={it.target.id} mediaStream={it.remoteStream} account={it.target.account} type={"DEFAULT"} />
          ))}
        </HStack>
      )}
    </VStack>
  )
}
