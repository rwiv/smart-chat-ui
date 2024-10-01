import {useEffect, useRef} from "react";
import {Account} from "@/graphql/types.ts";
import {css} from "@emotion/react";

const videoStyle = css`
  width: 32rem;
  height: 18rem;
  object-fit: initial;
`;

interface RtcVideoProps {
  mediaStream: MediaStream;
  account: Account;
}

export function RtcVideo({ mediaStream, account }: RtcVideoProps) {

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = remoteVideoRef.current;
    if (!videoEl) return;

    videoEl.srcObject = mediaStream;
  }, [remoteVideoRef]);

  return (
    <div>
      <video
        ref={remoteVideoRef}
        css={videoStyle}
        autoPlay
      />
      <div>{account.nickname}</div>
    </div>
  );
}
