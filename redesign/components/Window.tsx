"use client"

import { useRef, useState, useEffect } from "react"
import { motion, PanInfo, useDragControls } from "framer-motion"
import { useWindowStore } from "@/store/useWindowStore"
import { WindowState } from "@/lib/types"
import { cn } from "@/lib/utils"
import { X, Minus, Maximize2 } from "lucide-react"

// Import app components
import { FinderApp } from "./apps/FinderApp"
import { TerminalApp } from "./apps/TerminalApp"
import { NotesApp } from "./apps/NotesApp"
import { CalculatorApp } from "./apps/CalculatorApp"
import { SettingsApp } from "./apps/SettingsApp"
import { BrowserApp } from "./apps/BrowserApp"
import { TrashApp } from "./apps/TrashApp"

interface WindowProps {
  window: WindowState
}

export function Window({ window }: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    activeWindow,
  } = useWindowStore()

  const dragControls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)
  const isActive = activeWindow === window.id

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    const newX = Math.max(0, window.position.x + info.offset.x)
    const newY = Math.max(28, window.position.y + info.offset.y)
    updateWindowPosition(window.id, { x: newX, y: newY })
  }

  const renderAppContent = () => {
    switch (window.app) {
      case "finder":
        return <FinderApp />
      case "terminal":
        return <TerminalApp />
      case "notes":
        return <NotesApp />
      case "calculator":
        return <CalculatorApp />
      case "settings":
        return <SettingsApp />
      case "browser":
        return <BrowserApp />
      case "trash":
        return <TrashApp />
      default:
        return <div>App not found</div>
    }
  }

  if (window.isMinimized) {
    return null
  }

  const windowStyle = window.isMaximized
    ? {
        x: 0,
        y: 28,
        width: "100vw",
        height: "calc(100vh - 28px - 5rem)",
      }
    : {
        x: window.position.x,
        y: window.position.y,
        width: window.size.width,
        height: window.size.height,
      }

  return (
    <motion.div
      drag={!window.isMaximized}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: 0, top: 28 }}
      dragListener={false}
      onDragStart={() => {
        setIsDragging(true)
        focusWindow(window.id)
      }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...windowStyle,
        zIndex: window.zIndex,
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed rounded-xl shadow-2xl overflow-hidden",
        "vibrancy-light border border-white/20",
        isActive ? "ring-1 ring-blue-500/20" : ""
      )}
      onMouseDown={() => focusWindow(window.id)}
      style={{ willChange: "transform" }}
    >
      {/* Window Header */}
      <div
        className={cn(
          "h-11 flex items-center justify-between px-4",
          "vibrancy-toolbar border-b border-black/5",
          "cursor-move no-select"
        )}
        onPointerDown={(e) => {
          if (!window.isMaximized) {
            dragControls.start(e)
          }
        }}
      >
        {/* Traffic Lights */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => closeWindow(window.id)}
            className="traffic-light bg-red-500 hover:bg-red-600 group flex items-center justify-center"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.remove("hidden")
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.add("hidden")
            }}
          >
            <X className="w-2 h-2 text-red-900 hidden" strokeWidth={3} />
          </button>
          <button
            onClick={() => minimizeWindow(window.id)}
            className="traffic-light bg-yellow-500 hover:bg-yellow-600 group flex items-center justify-center"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.remove("hidden")
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.add("hidden")
            }}
          >
            <Minus className="w-2 h-2 text-yellow-900 hidden" strokeWidth={3} />
          </button>
          <button
            onClick={() => maximizeWindow(window.id)}
            className="traffic-light bg-green-500 hover:bg-green-600 group flex items-center justify-center"
            onMouseEnter={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.remove("hidden")
            }}
            onMouseLeave={(e) => {
              const icon = e.currentTarget.querySelector("svg")
              if (icon) icon.classList.add("hidden")
            }}
          >
            <Maximize2
              className="w-2 h-2 text-green-900 hidden"
              strokeWidth={3}
            />
          </button>
        </div>

        {/* Window Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium text-gray-700">
          {window.title}
        </div>
      </div>

      {/* Window Content */}
      <div className="w-full h-[calc(100%-2.75rem)] overflow-hidden">
        {renderAppContent()}
      </div>
    </motion.div>
  )
}
