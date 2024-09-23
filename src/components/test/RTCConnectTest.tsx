import {Account, ChatUser, useChatMessagesRTC} from "@/hooks/test/useChatMessagesRTC.ts";
import {useEffect, useRef} from "react";

interface Props {
  chatRoomId: number,
  myInfo: Account,
  chatUsers: ChatUser[],
  localStream: MediaStream,
}

export function RTCConnectTest({ chatRoomId, myInfo, chatUsers, localStream }: Props) {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteStreamRef = useRef(new MediaStream());
  const {connect} = useChatMessagesRTC(chatRoomId, myInfo, chatUsers, localStream, remoteStreamRef.current);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
    connect();
  }, [remoteVideoRef, remoteStreamRef]);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay css={{width:640, height: 360, objectFit: "initial"}}/>
    </div>
  );
}