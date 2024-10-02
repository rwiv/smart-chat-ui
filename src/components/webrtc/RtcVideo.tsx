import {useEffect, useRef} from "react";
import {Account} from "@/graphql/types.ts";
import {css} from "@emotion/react";

const defaultVideoStyle = css`
  width: 32rem;
  height: 18rem;
  object-fit: initial;
`;

const sharedMainVideoStyle = css`
  width: 64rem;
  height: 36rem;
  object-fit: initial;
`;

const sharedSubVideoStyle = css`
  width: 12.8rem;
  height: 7.2rem;
  object-fit: initial;
`;

interface RtcVideoProps {
  mediaStream: MediaStream;
  account: Account;
  type: "DEFAULT" | "SHARED_MAIN" | "SHARED_SUB";
}

export function RtcVideo({ mediaStream, account, type }: RtcVideoProps) {

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoEl = remoteVideoRef.current;
    if (!videoEl) return;

    videoEl.srcObject = mediaStream;
  }, [remoteVideoRef]);

  const getStyle = () => {
    switch (type) {
      case "DEFAULT":
        return defaultVideoStyle;
      case "SHARED_MAIN":
        return sharedMainVideoStyle;
      case "SHARED_SUB":
        return sharedSubVideoStyle;
      default:
        return defaultVideoStyle;
    }
  }

  return (
    <div>
      <video
        ref={remoteVideoRef}
        css={getStyle()}
        autoPlay
      />
      <div>username: {account.nickname}</div>
    </div>
  );
}
