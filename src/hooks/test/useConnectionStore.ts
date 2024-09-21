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
}

export class RtcConnection {
  constructor(
    public readonly pc: RTCPeerConnection,
    public readonly targetId: number,
  ) {
  }

  async emitRemoteDesc(prevCandidateMap: Map<number, RTCIceCandidate[]>) {
    const prevCandidates = prevCandidateMap.get(this.targetId) ?? [];
    for (const candidate of prevCandidates) {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    prevCandidateMap.delete(this.targetId);
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
  prevCandidateMap: Map<number, RTCIceCandidate[]>,
  addPrevCandidate: (targetId: number, candidate: RTCIceCandidate) => void;
}

export const useConnMapStore = create<ConnMapGlobalState>((set) => ({
  connMap: new ConnMap(),
  prevCandidateMap: new Map(),
  addPrevCandidate: (targetId, candidate) => set(prev => {
    const preCandidates = prev.prevCandidateMap.get(targetId);
    if (preCandidates === undefined) {
      const candidates = [candidate];
      prev.prevCandidateMap.set(targetId, candidates);
    } else {
      preCandidates.push(candidate);
    }
    return { ...prev };
  }),
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

