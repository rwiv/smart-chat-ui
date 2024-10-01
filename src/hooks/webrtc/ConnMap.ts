import {RtcConnection} from "@/hooks/webrtc/RtcConnection.ts";

export class ConnMap {

  constructor(
    public current: Map<string, RtcConnection> = new Map(),
  ) {
  }

  add(conn: RtcConnection) {
    const targetId = conn.targetId;
    const dup = this.get(targetId);
    if (dup !== undefined) {
      console.log("duplicated");
      console.log(dup);
      dup.close();
    }
    this.current.set(targetId, conn);
  }

  isInit() {
    return this.values().length === 0;
  }

  restore() {
    this.close();
    this.current = new Map();
  }

  close() {
    for (const conn of this.values()) {
      conn.close();
    }
  }

  get(key: string): RtcConnection | undefined {
    return this.current.get(key);
  }

  values(): RtcConnection[] {
    const result = [];
    for (const dcc of this.current.values()) {
      result.push(dcc);
    }
    return result;
  }

  async replaceStream(stream: MediaStream) {
    for (const conn of this.values()) {
      await conn.audioSender.replaceTrack(stream.getAudioTracks()[0]);
      await conn.videoSender.replaceTrack(stream.getVideoTracks()[0]);
    }
  }
}
