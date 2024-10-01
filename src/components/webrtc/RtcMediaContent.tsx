import {useEffect} from "react";
import {Account, ChatUser} from "@/graphql/types.ts";
import {useRtcConnections} from "@/hooks/websocket/useRtcConnections.ts";
import {useConnMapStore} from "@/hooks/webrtc/useConnMapStore.ts";
import {useMediaStreamStore} from "@/hooks/webrtc/useMediaStreamStore.ts";
import {RemoteRtcVideo} from "@/components/webrtc/RemoteRtcVideo.tsx";

interface ChatMessagesContentProps {
  chatRoomId: string;
  myInfo: Account;
  chatUsers: ChatUser[];
}

export function RtcMediaContent({ chatRoomId, myInfo, chatUsers }: ChatMessagesContentProps) {

  const {localStream, setLocalStream} = useMediaStreamStore();
  const {connect, disconnect} = useRtcConnections(chatRoomId, myInfo, chatUsers);
  const {connMap} = useConnMapStore();

  useEffect(() => {
    init();
    return () => {
      disconnect();
    }
  }, []);

  useEffect(() => {
    if (localStream === undefined) return;
    connect();
  }, [localStream]);

  const init = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
  }

  return (
    <div>
      {connMap.values().map(it => (
        <RemoteRtcVideo key={it.targetId} remoteStream={it.remoteStream} />
      ))}
    </div>
  )
}
