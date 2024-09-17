import {useEffect, useRef, useState} from "react";

interface ChatRoom {
  id: string;
  title: string;
}

export function VideoTestPage() {
  const [data, setData] = useState<ChatRoom[]>([]);
  const recordedChunks = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    req();
    createMediaStream();
  }, []);

  const req = async () => {
    const res = await fetch("http://localhost:8080/chat-rooms");
    const json = await res.json();
    console.log(json);
    setData(json);
  }

  const createMediaStream = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });

    const recorder = new MediaRecorder(stream, {mimeType: "video/webm"});
    // recorder.start(1000);
    mediaRecorder.current = recorder;

    recorder.ondataavailable = event => {
      console.log("asd")
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    console.log(stream);
  }

  // const onDlClick = () => {
  //   mediaRecorder.current?.stop();
  //   const blob = new Blob(recordedChunks.current, {
  //     type: 'video/webm'
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const anchor = anchorRef.current;
  //   if (anchor) {
  //     anchor.href = url;
  //     anchor.download = 'test.webm';
  //     anchor.click();
  //     URL.revokeObjectURL(url);
  //   }
  //   recordedChunks.current = [];
  // }

  return (
    <div>
      {data.map((chatRoom) => (
        <div key={chatRoom.id}>{chatRoom.title}</div>
      ))}
      <a ref={anchorRef} style={{display: 'none'}}></a>
      {/*<button onClick={onDlClick}>download</button>*/}
      <h2>test MediaStream</h2>
      <video ref={videoRef} autoPlay width={1280} height={720}/>
    </div>
  )
}
