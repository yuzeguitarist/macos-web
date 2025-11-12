"use client"

import { useState, useEffect } from "react"
import { formatTime, formatDate, cn } from "@/lib/utils"
import { Search, WifiIcon, BatteryFull } from "lucide-react"

export function MenuBar() {
  const [time, setTime] = useState(formatTime())
  const [date, setDate] = useState(formatDate())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime())
      setDate(formatDate())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-7",
        "vibrancy-toolbar border-b border-black/5",
        "flex items-center justify-between px-4",
        "text-[13px] font-medium text-gray-800 no-select"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Apple Logo */}
        <div className="flex items-center gap-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="currentColor"
            className="opacity-90"
          >
            <path d="M11.5 6.5c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-2-.9-3.3-.8C1.6.9.2 1.9 0 3.5c-1 3.1.3 7.6 2.1 10.1.9 1.2 2 2.6 3.4 2.5 1.3 0 1.8-.9 3.3-.9 1.6 0 2 .9 3.3.9 1.4 0 2.4-1.2 3.3-2.4.6-.8 1-1.6 1.3-2.5-2.9-1.1-3.2-5.1-.2-5.7z" />
            <path d="M9.5.5c.8-.9 1.3-2.2 1.2-3.5-1.1.1-2.5.8-3.3 1.7-.7.8-1.3 2.1-1.2 3.4 1.3.1 2.6-.6 3.3-1.6z" />
          </svg>
          <span className="hover:bg-black/5 px-2 py-0.5 rounded cursor-default transition-colors">
            访达
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-1">
          {["文件", "编辑", "显示", "前往", "窗口", "帮助"].map((item) => (
            <span
              key={item}
              className="hover:bg-black/5 px-2 py-0.5 rounded cursor-default transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Search className="w-3.5 h-3.5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
          <WifiIcon className="w-3.5 h-3.5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
          <BatteryFull className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-700">{date}</span>
          <span className="text-gray-700">{time}</span>
        </div>
      </div>
    </div>
  )
}
