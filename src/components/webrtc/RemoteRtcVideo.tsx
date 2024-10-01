import {useEffect, useRef} from "react";
import {css} from "@emotion/react";

interface RtcVideoProps {
  remoteStream: MediaStream;
}

const videoStyle = css`
  width: 640px;
  height: 360px;
  object-fit: initial;
`

export function RemoteRtcVideo({ remoteStream }: RtcVideoProps) {

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = remoteVideoRef.current;
    if (!videoEl) {
      return;
    }

    videoEl.srcObject = remoteStream;
  }, [remoteVideoRef]);

  return (
    <div>
      <div>asd</div>
      <video
        ref={remoteVideoRef}
        autoPlay
        css={videoStyle}
      />
    </div>
  );
}
