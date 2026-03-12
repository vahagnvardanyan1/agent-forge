import type { StateCreator } from "zustand";
import type { IUiStore } from "./types";

const createUiSlice: StateCreator<IUiStore> = () => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  theme: "system",
});

export default createUiSlice;
