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
import { useSystemStore } from "@/store/useSystemStore"

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

  const {
    darkMode,
    appearance,
    setAppearance,
    autoHideDock,
    setAutoHideDock,
    nightShift,
    setNightShift,
    soundEffects,
    setSoundEffects,
    notifications,
    setNotifications,
    fileVault,
    setFileVault,
    trueTone,
    setTrueTone,
    firewall,
    setFirewall,
    lockScreenNotifications,
    setLockScreenNotifications,
    bluetoothEnabled,
    setBluetoothEnabled,
    zoom,
    setZoom,
    displayContrast,
    setDisplayContrast,
    voiceOver,
    setVoiceOver,
    defaultBrowser,
    setDefaultBrowser,
    resolution,
    setResolution,
    refreshRate,
    setRefreshRate,
    cursorSize,
    setCursorSize,
  } = useSystemStore()

  return (
    <div className="flex h-full no-select">
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
                label="外观"
                description="选择浅色、深色或自动外观"
                control={
                  <select
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value as 'light' | 'dark' | 'auto')}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]"
                  >
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="auto">自动</option>
                  </select>
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
                  <select
                    value={defaultBrowser}
                    onChange={(e) => setDefaultBrowser(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]"
                  >
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
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]"
                  >
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
                  <Toggle enabled={nightShift} onChange={setNightShift} />
                }
              />
              <SettingItem
                label="True Tone"
                description="根据环境光调整显示器色温"
                control={
                  <Toggle enabled={trueTone} onChange={setTrueTone} />
                }
              />
              <SettingItem
                label="刷新率"
                description="选择显示器刷新率"
                control={
                  <select
                    value={refreshRate}
                    onChange={(e) => setRefreshRate(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]"
                  >
                    <option>60Hz</option>
                    <option>120Hz</option>
                  </select>
                }
              />
            </div>
          )}

          {selectedCategory === "security" && (
            <div className="space-y-6">
              <SettingItem
                label="FileVault"
                description="使用 FileVault 加密磁盘"
                control={
                  <Toggle enabled={fileVault} onChange={setFileVault} />
                }
              />
              <SettingItem
                label="防火墙"
                description="阻止传入连接"
                control={
                  <Toggle enabled={firewall} onChange={setFirewall} />
                }
              />
              <SettingItem
                label="隐私"
                description="管理应用权限"
                control={
                  <button className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-[13px] hover:bg-blue-600">
                    管理权限
                  </button>
                }
              />
            </div>
          )}

          {selectedCategory === "notifications" && (
            <div className="space-y-6">
              <SettingItem
                label="显示通知"
                description="允许应用发送通知"
                control={
                  <Toggle enabled={notifications} onChange={setNotifications} />
                }
              />
              <SettingItem
                label="在锁定屏幕上显示"
                description="锁定时显示通知"
                control={
                  <Toggle enabled={lockScreenNotifications} onChange={setLockScreenNotifications} />
                }
              />
              <SettingItem
                label="声音效果"
                description="播放通知声音"
                control={
                  <Toggle enabled={soundEffects} onChange={setSoundEffects} />
                }
              />
            </div>
          )}

          {selectedCategory === "network" && (
            <div className="space-y-6">
              <SettingItem
                label="Wi-Fi"
                description="已连接到 My Network"
                control={
                  <button className="px-4 py-1.5 border border-gray-300 rounded-md text-[13px] hover:bg-gray-50">
                    详细信息
                  </button>
                }
              />
              <SettingItem
                label="蓝牙"
                description="已启用"
                control={
                  <Toggle enabled={bluetoothEnabled} onChange={setBluetoothEnabled} />
                }
              />
              <SettingItem
                label="共享"
                description="文件共享、屏幕共享"
                control={
                  <button className="px-4 py-1.5 border border-gray-300 rounded-md text-[13px] hover:bg-gray-50">
                    设置
                  </button>
                }
              />
            </div>
          )}

          {selectedCategory === "users" && (
            <div className="space-y-6">
              <SettingItem
                label="当前用户"
                description="Guest"
                control={
                  <button className="px-4 py-1.5 border border-gray-300 rounded-md text-[13px] hover:bg-gray-50">
                    编辑
                  </button>
                }
              />
              <SettingItem
                label="登录项"
                description="管理开机启动项"
                control={
                  <button className="px-4 py-1.5 border border-gray-300 rounded-md text-[13px] hover:bg-gray-50">
                    管理
                  </button>
                }
              />
            </div>
          )}

          {selectedCategory === "accessibility" && (
            <div className="space-y-6">
              <SettingItem
                label="缩放"
                description="使用缩放功能放大屏幕"
                control={
                  <Toggle enabled={zoom} onChange={setZoom} />
                }
              />
              <SettingItem
                label="显示器对比度"
                description="增加显示器对比度"
                control={
                  <Toggle enabled={displayContrast} onChange={setDisplayContrast} />
                }
              />
              <SettingItem
                label="光标大小"
                description="调整光标大小"
                control={
                  <select
                    value={cursorSize}
                    onChange={(e) => setCursorSize(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-[13px]"
                  >
                    <option>正常</option>
                    <option>大</option>
                    <option>更大</option>
                  </select>
                }
              />
              <SettingItem
                label="语音"
                description="朗读选中的文本"
                control={
                  <Toggle enabled={voiceOver} onChange={setVoiceOver} />
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
        "relative w-12 h-7 rounded-full transition-all flex items-center toggle-glass",
        enabled && "active"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 bg-white rounded-full shadow-md transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
}
