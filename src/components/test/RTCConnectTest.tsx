import {Account, ChatUser, useChatMessagesRTC} from "@/hooks/test/useChatMessagesRTC.ts";
import {Button} from "@/components/ui/button.tsx";
import {useRef} from "react";

interface Props {
  chatRoomId: number,
  myInfo: Account,
  chatUsers: ChatUser[],
  myStream: MediaStream,
}

export function RTCConnectTest({ chatRoomId, myInfo, chatUsers, myStream }: Props) {
  const yourVideoRef = useRef<HTMLVideoElement | null>(null);
  const {connect} = useChatMessagesRTC(chatRoomId, myInfo, chatUsers, myStream, yourVideoRef);

  const startConnect = () => {
    connect();
  }

  return (
    <div>
      <Button onClick={startConnect}>connect</Button>
      <div>
        <div>your video</div>
        <video ref={yourVideoRef} autoPlay width={640} height={360}/>
      </div>
    </div>
  );
}