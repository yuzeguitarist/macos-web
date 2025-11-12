export type AppName =
  | "finder"
  | "terminal"
  | "notes"
  | "calculator"
  | "settings"
  | "browser"

export interface WindowState {
  id: string
  app: AppName
  title: string
  isMaximized: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

export interface FileSystemItem {
  name: string
  type: "note" | "text" | "page" | "html" | "folder"
  title: string
  content?: string
  children?: FileSystemItem[]
  createdAt: Date
  modifiedAt: Date
}

export interface AppConfig {
  name: AppName
  title: string
  icon: React.ReactNode
  defaultSize: { width: number; height: number }
  minSize?: { width: number; height: number }
  resizable?: boolean
}
