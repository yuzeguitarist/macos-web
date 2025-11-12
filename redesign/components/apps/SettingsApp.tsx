"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Settings,
  Palette,
  Monitor,
  Shield,
  Bell,
  Wifi,
  Users,
  Accessibility,
} from "lucide-react"

interface Category {
  id: string
  name: string
  icon: any
}

const categories: Category[] = [
  { id: "general", name: "通用", icon: Settings },
  { id: "appearance", name: "外观", icon: Palette },
  { id: "display", name: "显示器", icon: Monitor },
  { id: "security", name: "安全性与隐私", icon: Shield },
  { id: "notifications", name: "通知", icon: Bell },
  { id: "network", name: "网络", icon: Wifi },
  { id: "users", name: "用户与群组", icon: Users },
  { id: "accessibility", name: "辅助功能", icon: Accessibility },
]

export function SettingsApp() {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [darkMode, setDarkMode] = useState(false)
  const [autoHideDock, setAutoHideDock] = useState(false)

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-52 vibrancy-sidebar border-r border-black/5 p-3">
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors",
                  selectedCategory === category.id
                    ? "bg-gray-200/70 text-gray-900"
                    : "hover:bg-gray-200/50 text-gray-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {categories.find((c) => c.id === selectedCategory)?.name}
          </h2>

          {selectedCategory === "general" && (
            <div className="space-y-6">
              <SettingItem
                label="深色模式"
                description="使用深色外观"
                control={
                  <Toggle
                    enabled={darkMode}
                    onChange={setDarkMode}
                  />
                }
              />
              <SettingItem
                label="自动隐藏 Dock"
                description="鼠标移开时自动隐藏 Dock"
                control={
                  <Toggle
                    enabled={autoHideDock}
                    onChange={setAutoHideDock}
                  />
                }
              />
              <SettingItem
                label="默认浏览器"
                description="选择默认的网页浏览器"
                control={
                  <select className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]">
                    <option>Safari</option>
                    <option>Chrome</option>
                    <option>Firefox</option>
                  </select>
                }
              />
            </div>
          )}

          {selectedCategory === "appearance" && (
            <div className="space-y-6">
              <SettingItem
                label="外观"
                description="选择浅色或深色外观"
                control={
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[13px] hover:bg-gray-50">
                      浅色
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg text-[13px] hover:bg-gray-700">
                      深色
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-[13px] hover:bg-gray-50">
                      自动
                    </button>
                  </div>
                }
              />
              <SettingItem
                label="强调色"
                description="选择按钮和控制的颜色"
                control={
                  <div className="flex gap-2">
                    {["blue", "green", "orange", "red", "pink"].map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full cursor-pointer border-2 border-white shadow-md"
                        style={{
                          backgroundColor: {
                            blue: "#3b82f6",
                            green: "#10b981",
                            orange: "#f97316",
                            red: "#ef4444",
                            pink: "#ec4899",
                          }[color],
                        }}
                      />
                    ))}
                  </div>
                }
              />
            </div>
          )}

          {selectedCategory === "display" && (
            <div className="space-y-6">
              <SettingItem
                label="分辨率"
                description="调整显示器分辨率"
                control={
                  <select className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]">
                    <option>默认</option>
                    <option>1920 × 1080</option>
                    <option>2560 × 1440</option>
                    <option>3840 × 2160</option>
                  </select>
                }
              />
              <SettingItem
                label="夜览"
                description="减少蓝光以改善睡眠"
                control={
                  <Toggle enabled={false} onChange={() => {}} />
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SettingItemProps {
  label: string
  description: string
  control: React.ReactNode
}

function SettingItem({ label, description, control }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200/50">
      <div>
        <div className="text-[14px] font-medium text-gray-900">{label}</div>
        <div className="text-[12px] text-gray-500 mt-0.5">{description}</div>
      </div>
      <div>{control}</div>
    </div>
  )
}

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors",
        enabled ? "bg-blue-500" : "bg-gray-300"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
}
