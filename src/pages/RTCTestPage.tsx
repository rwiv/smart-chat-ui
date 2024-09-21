import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {RTCConnectTest} from "@/components/test/RTCConnectTest.tsx";

function getChatUsers(myId: number) {
  if (myId === 2) {
    return [{ account: { id: 1 } }];
  }
  return [];
}

const chatRoomId = 1;

export function RTCTestPage() {
  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  const [userId, setUserId] = useState<number | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    console.log("hello");
    createMediaStream();
  }, []);

  const onClick = (id: number) => {
    setUserId(id);
  }

  const createMediaStream = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }

    setMyStream(stream);
  }

  return (
    <div>
      <div>
        <h1>connection</h1>
        <div>{userId}</div>
        <div>
          <Button onClick={() => onClick(1)}>1</Button>
          <Button onClick={() => onClick(2)}>2</Button>
        </div>
      </div>
      <div>
        <h1>videos</h1>
        <div>
          <div>my video</div>
          <video ref={myVideoRef} autoPlay width={640} height={360}/>
        </div>
        {userId && myStream && (
          <RTCConnectTest
            chatRoomId={chatRoomId}
            myInfo={{ id: userId }}
            chatUsers={getChatUsers(userId)}
            myStream={myStream}
          />
        )}
      </div>
    </div>
  )
}
