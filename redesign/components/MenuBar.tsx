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
            height="17"
            viewBox="0 0 814 1000"
            fill="currentColor"
            className="opacity-90"
          >
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
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
