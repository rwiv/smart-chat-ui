import {create} from 'zustand';

export class ConnMap {

  constructor(public current: Map<number, RtcConnection> = new Map()) {
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

  get(key: number): RtcConnection | undefined {
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

export class RtcConnection {
  constructor(
    public readonly pc: RTCPeerConnection,
    public readonly targetId: number,
    public readonly audioSender: RTCRtpSender,
    public readonly videoSender: RTCRtpSender,
    public readonly remoteStream: MediaStream,
  ) {
  }

  close() {
    this.pc.close();
  }
}

export interface ConnMapGlobalState {
  connMap: ConnMap;
  addConn: (dcc: RtcConnection) => void;
  restore: () => void;
  refresh: () => void;
}

export const useConnMapStore = create<ConnMapGlobalState>((set) => ({
  connMap: new ConnMap(),
  addConn: dcc => set(prev => {
    const connMap = prev.connMap;
    connMap.add(dcc);
    return { ...prev, connMap };
  }),
  restore: () => set(prev => {
    const connMap = prev.connMap;
    connMap.restore();
    return { ...prev, connMap };
  }),
  refresh: () => set(prev => ({ ...prev })),
}));

