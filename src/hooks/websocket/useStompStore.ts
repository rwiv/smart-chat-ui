import {create} from "zustand";
import {StompClient} from "@/hooks/websocket/StompClient.ts";

export interface StompGlobalState {
  stompClient: StompClient;
}

export const useStompStore = create<StompGlobalState>(() => ({
  stompClient: new StompClient(undefined, []),
}));
