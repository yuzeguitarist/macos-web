"use client"

import { useState } from "react"
import { useFileSystemStore } from "@/store/useFileSystemStore"
import { cn } from "@/lib/utils"
import { Folder, FileText, RefreshCw, ChevronRight, Star, Cloud, HardDrive } from "lucide-react"

export function FinderApp() {
  const { files } = useFileSystemStore()
  const [selectedCategory, setSelectedCategory] = useState("个人收藏")

  const categories = [
    { name: "个人收藏", icon: Star, items: ["下载", "文稿", "桌面"] },
    { name: "iCloud", icon: Cloud, items: [] },
    { name: "位置", icon: HardDrive, items: ["Macintosh HD"] },
  ]

  return (
    <div className="flex h-full no-select">
      {/* Sidebar */}
      <div className="w-48 vibrancy-sidebar border-r border-black/5 p-2 space-y-1">
        {categories.map((category) => (
          <div key={category.name} className="space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <category.icon className="w-3 h-3" />
              {category.name}
            </div>
            {category.items.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1 rounded-md text-[13px]",
                  "hover:bg-gray-200/50 transition-colors",
                  selectedCategory === item
                    ? "bg-gray-200/70 text-gray-900"
                    : "text-gray-700"
                )}
              >
                <Folder className="w-4 h-4" />
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-11 vibrancy-toolbar border-b border-black/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <span>文稿</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">{selectedCategory}</span>
          </div>
          <button className="p-1.5 hover:bg-gray-200/50 rounded-md transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* File Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100/50 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="text-[12px] text-center text-gray-700 max-w-full truncate">
                  {file.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
