import { create } from "zustand"
import { WindowState, AppName } from "@/lib/types"

interface WindowStore {
  windows: WindowState[]
  activeWindow: string | null
  zIndexCounter: number
  createWindow: (app: AppName, config: Partial<WindowState>) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
  updateWindowSize: (id: string, size: { width: number; height: number }) => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindow: null,
  zIndexCounter: 1000,

  createWindow: (app, config) => {
    const { windows, zIndexCounter } = get()

    // Check if window already exists
    const existing = windows.find((w) => w.app === app)
    if (existing) {
      set({
        activeWindow: existing.id,
        windows: windows.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 }
            : w
        ),
        zIndexCounter: zIndexCounter + 1,
      })
      return
    }

    const newWindow: WindowState = {
      id: `window-${app}-${Date.now()}`,
      app,
      title: config.title || app,
      isMaximized: false,
      isMinimized: false,
      position: config.position || { x: 100, y: 100 },
      size: config.size || { width: 800, height: 600 },
      zIndex: zIndexCounter + 1,
      ...config,
    }

    set({
      windows: [...windows, newWindow],
      activeWindow: newWindow.id,
      zIndexCounter: zIndexCounter + 1,
    })
  },

  closeWindow: (id) => {
    const { windows, activeWindow } = get()
    const newWindows = windows.filter((w) => w.id !== id)

    set({
      windows: newWindows,
      activeWindow: activeWindow === id ? null : activeWindow,
    })
  },

  focusWindow: (id) => {
    const { windows, zIndexCounter } = get()

    set({
      activeWindow: id,
      windows: windows.map((w) =>
        w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w
      ),
      zIndexCounter: zIndexCounter + 1,
    })
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    }))
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }))
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }))
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    }))
  },
}))
