import {create} from "zustand";

export interface MediaStreamGlobalState {
  localStream: MediaStream | undefined;
  setLocalStream: (stream: MediaStream) => void;
}

export const useMediaStreamStore = create<MediaStreamGlobalState>((set) => ({
  localStream: undefined,
  setLocalStream: (localStream) => set(prev => ({ ...prev, localStream })),
}));
