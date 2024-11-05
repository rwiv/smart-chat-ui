import {useEffect, useRef} from "react";
import {Account} from "@/graphql/types.ts";
import {css} from "@emotion/react";
import {Center, HStack} from "@/lib/style/layouts.tsx";

const defaultVideoStyle = css`
  width: 22.4rem;
  height: 12.6rem;
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
    <div className="relative">
      <video
        ref={remoteVideoRef}
        css={getStyle()}
        autoPlay
      />
      <div className="absolute" css={css`
        background-color: rgba(0, 0, 0, 0.7);
        bottom: 0.5rem;
        left: 0.5rem;
        border-radius: 0.5rem;
        padding: 0.1rem 0.6rem;
        pointer-events: none;
      `}>
        <HStack>
          <Center>
            <div css={css`
              background-color: #00ff00;
              border-radius: 50%;
              width: 0.4rem;
              height: 0.4rem;
            `}/>
          </Center>
          <div css={css`
            color: white;
          `}>
            {account.nickname}
          </div>
        </HStack>
      </div>
    </div>
  );
}
