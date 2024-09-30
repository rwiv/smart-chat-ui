import {create} from 'zustand';

export type SidebarState = "CHATROOM" | "VIDEO" | "SEARCH";

interface GlobalState {
  sidebarState: SidebarState;
  setSidebarState: (sidebarState: SidebarState) => void;
}

export const useSidebarStateStore = create<GlobalState>((set) => ({
  sidebarState: "CHATROOM",
  setSidebarState: (sidebarState) => set(() => ({ sidebarState})),
}));
