"use client"

import { useState, useEffect, useRef } from "react"
import { formatTime, formatDate, cn } from "@/lib/utils"
import { Search, WifiIcon, BatteryFull, Volume2, Moon } from "lucide-react"
import { useWindowStore } from "@/store/useWindowStore"
import { useSystemStore } from "@/store/useSystemStore"

interface DropdownMenu {
  label: string
  items: (
    | { label: string; action?: () => void; disabled?: boolean; separator?: never }
    | { separator: true; label?: never; action?: never; disabled?: never }
  )[]
}

export function MenuBar() {
  const [time, setTime] = useState(formatTime())
  const [date, setDate] = useState(formatDate())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const controlRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const { createWindow } = useWindowStore()
  const {
    volume,
    setVolume,
    brightness,
    setBrightness,
    wifiEnabled,
    setWifiEnabled,
  } = useSystemStore()

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime())
      setDate(formatDate())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setShowControlCenter(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const menuItems: DropdownMenu[] = [
    {
      label: "访达",
      items: [
        { label: "关于访达" },
        { separator: true },
        { label: "偏好设置..." },
        { separator: true },
        { label: "清空废纸篓..." },
        { separator: true },
        { label: "隐藏访达" },
        { label: "隐藏其他" },
        { label: "全部显示" },
      ],
    },
    {
      label: "文件",
      items: [
        { label: "新建访达窗口", action: () => createWindow("finder", { title: "访达" }) },
        { label: "新建文件夹" },
        { label: "新建智能文件夹" },
        { separator: true },
        { label: "打开" },
        { label: "关闭窗口" },
      ],
    },
    {
      label: "编辑",
      items: [
        { label: "撤销" },
        { label: "重做" },
        { separator: true },
        { label: "剪切" },
        { label: "拷贝" },
        { label: "粘贴" },
        { label: "全选" },
      ],
    },
    {
      label: "显示",
      items: [
        { label: "图标视图" },
        { label: "列表视图" },
        { label: "分栏视图" },
        { label: "画廊视图" },
        { separator: true },
        { label: "显示工具栏" },
        { label: "显示边栏" },
        { label: "显示预览" },
      ],
    },
    {
      label: "前往",
      items: [
        { label: "后退" },
        { label: "前进" },
        { label: "封闭文件夹" },
        { separator: true },
        { label: "电脑" },
        { label: "主目录" },
        { label: "桌面" },
        { label: "文档" },
        { label: "下载" },
      ],
    },
    {
      label: "窗口",
      items: [
        { label: "最小化" },
        { label: "缩放" },
        { separator: true },
        { label: "全部置于前面" },
      ],
    },
    {
      label: "帮助",
      items: [
        { label: "macOS 帮助" },
        { separator: true },
        { label: "提示" },
      ],
    },
  ]

  const handleMenuClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label)
  }

  const handleMenuItemClick = (action?: () => void) => {
    if (action) {
      action()
    }
    setActiveMenu(null)
  }

  return (
    <div
      ref={menuRef}
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
          <button
            onClick={() => handleMenuClick("apple")}
            className="hover:bg-black/5 px-1 py-0.5 rounded cursor-default transition-colors"
          >
            <svg
              width="14"
              height="17"
              viewBox="0 0 814 1000"
              fill="currentColor"
              className="opacity-90"
            >
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
            </svg>
          </button>

          {/* Apple Menu Dropdown */}
          {activeMenu === "apple" && (
            <div className="absolute top-7 left-4 w-56 vibrancy-menu rounded-lg shadow-2xl border border-black/10 py-1 z-[60]">
              <MenuItem label="关于本机" onClick={() => handleMenuItemClick()} />
              <MenuSeparator />
              <MenuItem label="系统设置..." onClick={() => handleMenuItemClick(() => createWindow("settings", { title: "系统设置" }))} />
              <MenuItem label="App Store..." onClick={() => handleMenuItemClick()} />
              <MenuSeparator />
              <MenuItem label="最近使用的项目" onClick={() => handleMenuItemClick()} />
              <MenuSeparator />
              <MenuItem label="强制退出..." onClick={() => handleMenuItemClick()} />
              <MenuSeparator />
              <MenuItem label="睡眠" onClick={() => handleMenuItemClick()} />
              <MenuItem label="重新启动..." onClick={() => handleMenuItemClick()} />
              <MenuItem label="关机..." onClick={() => handleMenuItemClick()} />
              <MenuSeparator />
              <MenuItem label="锁定屏幕" onClick={() => handleMenuItemClick()} />
              <MenuItem label="退出登录..." onClick={() => handleMenuItemClick()} />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-2">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => handleMenuClick(menu.label)}
                className={cn(
                  "hover:bg-black/5 px-2 py-0.5 rounded cursor-default transition-colors",
                  activeMenu === menu.label && "bg-black/10"
                )}
              >
                {menu.label}
              </button>

              {/* Dropdown Menu */}
              {activeMenu === menu.label && (
                <div className="absolute top-7 left-0 w-56 vibrancy-menu rounded-lg shadow-2xl border border-black/10 py-1 z-[60]">
                  {menu.items.map((item, idx) =>
                    item.separator ? (
                      <MenuSeparator key={idx} />
                    ) : (
                      <MenuItem
                        key={idx}
                        label={item.label}
                        onClick={() => handleMenuItemClick(item.action)}
                        disabled={item.disabled}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-gray-700 relative">
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:bg-black/5 p-1 rounded transition-colors"
            >
              <Search className="w-3.5 h-3.5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            </button>

            {/* Search Popup */}
            {showSearch && (
              <div
                ref={searchRef}
                className="absolute top-7 right-0 w-96 vibrancy-menu rounded-2xl shadow-2xl border border-black/10 p-4 z-[60]"
              >
                <input
                  type="text"
                  placeholder="Spotlight 搜索"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300/50 bg-white/60 text-[13px] text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setShowControlCenter(!showControlCenter)}
            className="hover:bg-black/5 p-1 rounded transition-colors flex items-center gap-2"
          >
            <WifiIcon className="w-3.5 h-3.5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            <Volume2 className="w-3.5 h-3.5 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
            <BatteryFull className="w-4 h-4 opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
          </button>

          {/* Control Center */}
          {showControlCenter && (
            <div
              ref={controlRef}
              className="absolute top-7 right-0 w-80 vibrancy-menu rounded-2xl shadow-2xl border border-black/10 p-4 z-[60]"
            >
              <div className="space-y-3">
                {/* WiFi */}
                <div className="vibrancy-card rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WifiIcon className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-800">Wi-Fi</span>
                    </div>
                    <button
                      onClick={() => setWifiEnabled(!wifiEnabled)}
                      className={cn(
                        "relative w-10 h-6 rounded-full transition-all flex items-center toggle-glass",
                        wifiEnabled && "active"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 bg-white rounded-full shadow-md transition-transform",
                          wifiEnabled ? "translate-x-5" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                  {wifiEnabled && (
                    <div className="text-[12px] text-gray-600">已连接到 My Network</div>
                  )}
                </div>

                {/* Volume */}
                <div className="vibrancy-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-gray-800">音量</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full glass-slider"
                  />
                </div>

                {/* Brightness */}
                <div className="vibrancy-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-gray-800">亮度</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full glass-slider"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowControlCenter(!showControlCenter)}
          className="flex items-center gap-1.5 hover:bg-black/5 px-2 py-0.5 rounded transition-colors"
        >
          <span className="text-gray-700">{date}</span>
          <span className="text-gray-700">{time}</span>
        </button>
      </div>
    </div>
  )
}

function MenuItem({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-4 py-1 text-[13px] transition-colors rounded-md",
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-800 hover:bg-blue-500 hover:text-white"
      )}
    >
      {label}
    </button>
  )
}

function MenuSeparator() {
  return <div className="h-px bg-gray-200 my-1" />
}
