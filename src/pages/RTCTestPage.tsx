import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {RTCConnectTest} from "@/components/test/RTCConnectTest.tsx";
import {login, LoginRequest} from "@/client/account.ts";
import { HStack } from "@/lib/style/layouts";
import {useConnMapStore} from "@/hooks/test/useConnectionStore.ts";

function getChatUsers(myId: number) {
  if (myId === 2) {
    return [{ account: { id: 1 } }];
  }
  return [];
}

// 빈 비디오 트랙 생성
function createEmptyVideo() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  return canvas.captureStream();
}

function createEmptyAudio() {
  const audioDestination = new AudioContext().createMediaStreamDestination();
  return audioDestination.stream;
}

function createEmptyStream() {
  const video = createEmptyVideo();
  const audio = createEmptyAudio();

  const stream = new MediaStream();
  stream.addTrack(video.getVideoTracks()[0]);
  stream.addTrack(audio.getAudioTracks()[0]);

  return stream;
}

const chatRoomId = 1;

export function RTCTestPage() {
  const myVideoRef = useRef<HTMLVideoElement | null>(null);

  const [userId, setUserId] = useState<number | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const {connMap} = useConnMapStore();

  useEffect(() => {
    console.log("hello");
    onLoginUser1();
  }, []);

  useEffect(() => {
    const stream = createEmptyStream();
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }
    setLocalStream(stream);
  }, [myVideoRef]);

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

    setLocalStream(stream);
    await connMap.replaceStream(stream);
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
            <div>asd</div>
          </div>
          {userId && localStream && (
            <RTCConnectTest
              chatRoomId={chatRoomId}
              myInfo={{ id: userId }}
              chatUsers={getChatUsers(userId)}
              localStream={localStream}
            />
          )}
        </HStack>
      </div>
    </div>
  )
}
