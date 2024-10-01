import {create} from "zustand";
import {ConnMap} from "@/hooks/webrtc/ConnMap.ts";
import {RtcConnection} from "@/hooks/webrtc/RtcConnection.ts";

export interface ConnMapGlobalState {
  connMap: ConnMap;
  addConn: (dcc: RtcConnection) => void;
  restoreConnMap: () => void;
  refreshConnMap: () => void;
}

export const useConnMapStore = create<ConnMapGlobalState>((set) => ({
  connMap: new ConnMap(),
  addConn: dcc => set(prev => {
    const connMap = prev.connMap;
    connMap.add(dcc);
    return { ...prev, connMap };
  }),
  restoreConnMap: () => set(prev => {
    const connMap = prev.connMap;
    connMap.restore();
    return { ...prev, connMap };
  }),
  refreshConnMap: () => set(prev => ({ ...prev })),
}));

