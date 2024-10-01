import {useEffect, useState} from "react";
import {Account, ChatUser, Mutation} from "@/graphql/types.ts";
import {useRtcConnections} from "@/hooks/websocket/useRtcConnections.ts";
import {useConnMapStore} from "@/hooks/webrtc/useConnMapStore.ts";
import {useMediaStreamStore} from "@/hooks/webrtc/useMediaStreamStore.ts";
import {RtcVideo} from "@/components/webrtc/RtcVideo.tsx";
import {HStack, VStack} from "@/lib/style/layouts.tsx";
import {Button} from "@/components/ui/button.tsx";
import {css} from "@emotion/react";
import {useApolloClient} from "@apollo/client";
import {updateSharedChatUserQL} from "@/client/chatRoom.ts";

const buttonStyle = css`
  background: #007eff;
  width: 6rem;
  height: 2.7rem;
  font-size: 0.9rem;
`;

interface ChatMessagesContentProps {
  chatRoomId: string;
  myInfo: Account;
  chatUsers: ChatUser[];
}

export function RtcMediaContent({ chatRoomId, myInfo, chatUsers }: ChatMessagesContentProps) {

  const {connMap} = useConnMapStore();
  const {localStream, setLocalStream} = useMediaStreamStore();
  const apolloClient = useApolloClient();
  const {connect, disconnect} = useRtcConnections(chatRoomId, myInfo, chatUsers);
  const [sharedId, setSharedId] = useState<string | undefined>(undefined);

  useEffect(() => {
    init();
    return () => {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (!localStream) return;
    connect();
  }, [localStream])

  const init = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
  }

  const onClickShareBtn = async () => {
    const res = await apolloClient.query<Mutation>({
      query: updateSharedChatUserQL, variables: { chatRoomId }, fetchPolicy: "no-cache",
    });
    const sharedId = res.data?.updateSharedChatUser?.sharedChatUserId
    if (!sharedId) {
      throw new Error("sharedId is not found");
    }
    setSharedId(sharedId);
  }

  return (
    <div>
      <VStack>
        <HStack className="mt-3 mb-3 ml-4 mr-5" css={{justifyContent: "space-between"}}>
          <div></div>
          <div>
            <Button css={buttonStyle} onClick={onClickShareBtn}>화면 공유</Button>
          </div>
        </HStack>
        <HStack>
          {localStream && (
            <RtcVideo
              mediaStream={localStream}
              account={myInfo}
            />
          )}
          {connMap.values().map(it => (
            <RtcVideo
              key={it.target.id}
              mediaStream={it.remoteStream}
              account={it.target.account}
            />
          ))}
        </HStack>
      </VStack>
    </div>
  )
}
