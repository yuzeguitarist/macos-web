"use client"

import { motion } from "framer-motion"
import { useWindowStore } from "@/store/useWindowStore"
import { AppName } from "@/lib/types"
import {
  Folder,
  Terminal,
  FileText,
  Calculator,
  Settings,
  Globe,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const dockApps: Array<{ name: AppName; icon: React.ReactNode; label: string }> = [
  { name: "finder", icon: <Folder className="w-full h-full" />, label: "访达" },
  {
    name: "terminal",
    icon: <Terminal className="w-full h-full" />,
    label: "终端",
  },
  {
    name: "notes",
    icon: <FileText className="w-full h-full" />,
    label: "备忘录",
  },
  {
    name: "calculator",
    icon: <Calculator className="w-full h-full" />,
    label: "计算器",
  },
  {
    name: "settings",
    icon: <Settings className="w-full h-full" />,
    label: "系统设置",
  },
  {
    name: "browser",
    icon: <Globe className="w-full h-full" />,
    label: "Safari",
  },
]

export function Dock() {
  const { createWindow, windows } = useWindowStore()
  const [hoveredApp, setHoveredApp] = useState<AppName | null>(null)

  const isAppRunning = (appName: AppName) => {
    return windows.some((w) => w.app === appName && !w.isMinimized)
  }

  const handleAppClick = (app: AppName) => {
    const defaultSizes: Record<AppName, { width: number; height: number }> = {
      finder: { width: 900, height: 600 },
      terminal: { width: 700, height: 500 },
      notes: { width: 800, height: 600 },
      calculator: { width: 320, height: 520 },
      settings: { width: 900, height: 650 },
      browser: { width: 1000, height: 700 },
    }

    createWindow(app, {
      title: dockApps.find((a) => a.name === app)?.label || app,
      size: defaultSizes[app],
      position: {
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
      },
    })
  }

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "flex items-center gap-1 px-2 py-2 rounded-2xl",
          "glass-medium border border-white/20",
          "shadow-2xl shadow-black/20"
        )}
      >
        {dockApps.map((app, index) => (
          <DockIcon
            key={app.name}
            app={app}
            isRunning={isAppRunning(app.name)}
            onClick={() => handleAppClick(app.name)}
            onHover={(hovered) => setHoveredApp(hovered ? app.name : null)}
            index={index}
          />
        ))}

        {/* Separator */}
        <div className="w-px h-10 bg-gray-400/30 mx-1" />

        {/* Trash */}
        <DockIcon
          app={{ name: "trash", icon: <Trash2 className="w-full h-full" />, label: "废纸篓" }}
          isRunning={false}
          onClick={() => {}}
          onHover={(hovered: boolean) => {}}
          index={dockApps.length}
        />
      </motion.div>
    </div>
  )
}

interface DockIconProps {
  app: { name: string; icon: React.ReactNode; label: string }
  isRunning: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
  index: number
}

function DockIcon({ app, isRunning, onClick, onHover, index }: DockIconProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      className={cn(
        "relative flex items-center gap-2 px-2 py-1.5 rounded-xl",
        "bg-white/40 hover:bg-white/60",
        "backdrop-filter backdrop-blur-md",
        "text-gray-700",
        "transition-all duration-200",
        "border border-white/30",
        "group"
      )}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onHover(false)
      }}
    >
      {/* Icon */}
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        <div className="w-6 h-6">{app.icon}</div>
      </div>

      {/* Label */}
      <motion.span
        className="text-[11px] font-medium whitespace-nowrap pr-1"
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          width: isHovered ? "auto" : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        {app.label}
      </motion.span>

      {/* Running Indicator */}
      {isRunning && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-700" />
      )}
    </motion.button>
  )
}
