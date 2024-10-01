import {Account} from "@/graphql/types.ts";

export class RtcConnection {
  constructor(
    public readonly pc: RTCPeerConnection,
    public readonly targetId: string,
    public readonly audioSender: RTCRtpSender,
    public readonly videoSender: RTCRtpSender,
    public readonly remoteStream: MediaStream,
    public target: Account | undefined = undefined,
  ) {
  }

  setTarget(target: Account) {
    this.target = target;
  }

  close() {
    this.pc.close();
  }
}
