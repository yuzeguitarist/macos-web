import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SystemSettings {
  // General
  darkMode: boolean
  autoHideDock: boolean
  defaultBrowser: string

  // Appearance
  appearance: 'light' | 'dark' | 'auto'
  accentColor: string

  // Display
  resolution: string
  nightShift: boolean
  trueTone: boolean
  refreshRate: string

  // Security
  fileVault: boolean
  firewall: boolean

  // Notifications
  notifications: boolean
  lockScreenNotifications: boolean
  soundEffects: boolean

  // Network
  wifiEnabled: boolean
  bluetoothEnabled: boolean

  // Accessibility
  zoom: boolean
  displayContrast: boolean
  cursorSize: string
  voiceOver: boolean

  // System
  volume: number
  brightness: number
}

interface SystemStore extends SystemSettings {
  setDarkMode: (enabled: boolean) => void
  setAutoHideDock: (enabled: boolean) => void
  setDefaultBrowser: (browser: string) => void
  setAppearance: (appearance: 'light' | 'dark' | 'auto') => void
  setAccentColor: (color: string) => void
  setResolution: (resolution: string) => void
  setNightShift: (enabled: boolean) => void
  setTrueTone: (enabled: boolean) => void
  setRefreshRate: (rate: string) => void
  setFileVault: (enabled: boolean) => void
  setFirewall: (enabled: boolean) => void
  setNotifications: (enabled: boolean) => void
  setLockScreenNotifications: (enabled: boolean) => void
  setSoundEffects: (enabled: boolean) => void
  setWifiEnabled: (enabled: boolean) => void
  setBluetoothEnabled: (enabled: boolean) => void
  setZoom: (enabled: boolean) => void
  setDisplayContrast: (enabled: boolean) => void
  setCursorSize: (size: string) => void
  setVoiceOver: (enabled: boolean) => void
  setVolume: (volume: number) => void
  setBrightness: (brightness: number) => void
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      // Initial state
      darkMode: false,
      autoHideDock: false,
      defaultBrowser: 'Safari',
      appearance: 'light',
      accentColor: 'blue',
      resolution: '默认',
      nightShift: false,
      trueTone: true,
      refreshRate: '60Hz',
      fileVault: false,
      firewall: true,
      notifications: true,
      lockScreenNotifications: false,
      soundEffects: true,
      wifiEnabled: true,
      bluetoothEnabled: true,
      zoom: false,
      displayContrast: false,
      cursorSize: '正常',
      voiceOver: false,
      volume: 70,
      brightness: 80,

      // Actions
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setAutoHideDock: (enabled) => set({ autoHideDock: enabled }),
      setDefaultBrowser: (browser) => set({ defaultBrowser: browser }),
      setAppearance: (appearance) => set({ appearance }),
      setAccentColor: (color) => set({ accentColor: color }),
      setResolution: (resolution) => set({ resolution }),
      setNightShift: (enabled) => set({ nightShift: enabled }),
      setTrueTone: (enabled) => set({ trueTone: enabled }),
      setRefreshRate: (rate) => set({ refreshRate: rate }),
      setFileVault: (enabled) => set({ fileVault: enabled }),
      setFirewall: (enabled) => set({ firewall: enabled }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setLockScreenNotifications: (enabled) => set({ lockScreenNotifications: enabled }),
      setSoundEffects: (enabled) => set({ soundEffects: enabled }),
      setWifiEnabled: (enabled) => set({ wifiEnabled: enabled }),
      setBluetoothEnabled: (enabled) => set({ bluetoothEnabled: enabled }),
      setZoom: (enabled) => set({ zoom: enabled }),
      setDisplayContrast: (enabled) => set({ displayContrast: enabled }),
      setCursorSize: (size) => set({ cursorSize: size }),
      setVoiceOver: (enabled) => set({ voiceOver: enabled }),
      setVolume: (volume) => set({ volume }),
      setBrightness: (brightness) => set({ brightness }),
    }),
    {
      name: 'system-settings',
    }
  )
)
