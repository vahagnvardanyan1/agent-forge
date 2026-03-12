export interface IUiStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  theme: "light" | "dark" | "system";
}
