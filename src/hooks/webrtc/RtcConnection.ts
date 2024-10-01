import {ChatUser} from "@/graphql/types.ts";

export class RtcConnection {
  constructor(
    public readonly pc: RTCPeerConnection,
    public readonly target: ChatUser,
    public readonly audioSender: RTCRtpSender,
    public readonly videoSender: RTCRtpSender,
    public readonly remoteStream: MediaStream,
  ) {
  }

  close() {
    this.pc.close();
  }
}
