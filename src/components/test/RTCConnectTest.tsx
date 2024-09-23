import {Account, ChatUser, useChatMessagesRTC} from "@/hooks/test/useChatMessagesRTC.ts";
import {useEffect, useRef} from "react";

interface Props {
  chatRoomId: number,
  myInfo: Account,
  chatUsers: ChatUser[],
  myStream: MediaStream,
}

export function RTCConnectTest({ chatRoomId, myInfo, chatUsers, myStream }: Props) {
  const yourVideoRef = useRef<HTMLVideoElement | null>(null);
  const {connect} = useChatMessagesRTC(chatRoomId, myInfo, chatUsers, myStream, yourVideoRef);

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <video ref={yourVideoRef} autoPlay css={{width:640, height: 360, objectFit: "initial"}}/>
    </div>
  );
}