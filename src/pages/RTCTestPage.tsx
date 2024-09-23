import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {RTCConnectTest} from "@/components/test/RTCConnectTest.tsx";
import {login, LoginRequest} from "@/client/account.ts";
import { HStack } from "@/lib/style/layouts";

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
    onLoginUser1();
  }, []);

  const onLoginUser1 = async () => {
    const req: LoginRequest = {
      username: "user1@gmail.com",
      password: "1234",
    };
    const res = await login(req, false);
    console.log(await res.text());
  }

  const onClick = (id: number) => {
    setUserId(id);
  }

  const onSelectMediaStream = async () => {
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
        {/*<div>{userId}</div>*/}
        <div>
          <Button onClick={() => onClick(1)}>1</Button>
          <Button onClick={() => onClick(2)}>2</Button>
          <Button onClick={onSelectMediaStream}>Connect</Button>
        </div>
      </div>
      <div>
        <h1>videos</h1>
        <HStack>
          <div>
            <video ref={myVideoRef} autoPlay css={{width:640, height: 360, objectFit: "initial"}} />
          </div>
          {userId && myStream && (
            <RTCConnectTest
              chatRoomId={chatRoomId}
              myInfo={{ id: userId }}
              chatUsers={getChatUsers(userId)}
              myStream={myStream}
            />
          )}
        </HStack>
      </div>
    </div>
  )
}
