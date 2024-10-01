import {create} from "zustand";
import {StompClient} from "@/hooks/websocket/StompClient.ts";
import {createStompClient} from "@/lib/web/stomp.ts";

export interface StompGlobalState {
  stompClient: StompClient | undefined;
  closeStompClient: () => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
  initStompClient: () => void;
  refreshStompClient: () => void;
}

export const useStompStore = create<StompGlobalState>((set) => ({
  stompClient: undefined,
  isConnected: false,
  closeStompClient: () => set(prev => {
    prev.stompClient?.close();
    return { ...prev, stompClient: undefined };
  }),
  initStompClient: () => set(prev => {
    const stomp = createStompClient();
    stomp.onConnect = () => {
      prev.setIsConnected(true);
    };
    stomp.activate();
    const stompClient = new StompClient(stomp, []);
    return {...prev, stompClient};
  }),
  refreshStompClient: () => set(prev => ({ ...prev })),
  setIsConnected: (isConnected) => set({ isConnected }),
}));
