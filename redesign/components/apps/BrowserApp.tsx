"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, RotateCw, Home, Search, Globe, Shield, Zap, Battery } from "lucide-react"

export function BrowserApp() {
  const [history, setHistory] = useState<string[]>(["www.apple.com"])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputUrl, setInputUrl] = useState("www.apple.com")

  const url = history[currentIndex]
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < history.length - 1

  const handleNavigate = (newUrl: string) => {
    // 截断forward历史并添加新URL
    const newHistory = history.slice(0, currentIndex + 1)
    newHistory.push(newUrl)
    setHistory(newHistory)
    setCurrentIndex(newHistory.length - 1)
    setInputUrl(newUrl)
  }

  const goBack = () => {
    if (canGoBack) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      setInputUrl(history[newIndex])
    }
  }

  const goForward = () => {
    if (canGoForward) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      setInputUrl(history[newIndex])
    }
  }

  const handleRefresh = () => {
    // 刷新当前页面
    setInputUrl(url)
  }

  const handleHome = () => {
    handleNavigate("www.apple.com")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Browser Toolbar */}
      <div className="h-12 vibrancy-toolbar border-b border-black/5 flex items-center gap-3 px-4">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            disabled={!canGoBack}
            onClick={goBack}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              canGoBack
                ? "hover:bg-gray-200/50 text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={!canGoForward}
            onClick={goForward}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              canGoForward
                ? "hover:bg-gray-200/50 text-gray-700"
                : "text-gray-400 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 border border-gray-300/50">
          <Search className="w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNavigate(inputUrl)
              }
            }}
            className="flex-1 bg-transparent text-[13px] text-gray-700 outline-none"
            placeholder="搜索或输入网站名称"
          />
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-gray-200/50 rounded-md transition-colors"
          >
            <RotateCw className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={handleHome}
            className="p-1.5 hover:bg-gray-200/50 rounded-md transition-colors"
          >
            <Home className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto p-12">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">欢迎使用 Safari</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Safari 是世界上最快的浏览器，专为 macOS 打造。
              享受更好的隐私保护和卓越的性能。
            </p>

            {/* Quick Links */}
            <div className="grid grid-cols-4 gap-4 mt-12">
              {[
                { name: "Apple", url: "www.apple.com" },
                { name: "GitHub", url: "github.com" },
                { name: "Stack Overflow", url: "stackoverflow.com" },
                { name: "MDN", url: "developer.mozilla.org" },
              ].map((site) => (
                <button
                  key={site.name}
                  onClick={() => handleNavigate(site.url)}
                  className="p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors group"
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded" />
                  </div>
                  <div className="text-[13px] font-medium text-gray-700">
                    {site.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-16 text-left">
              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                  隐私保护
                </h3>
                <p className="text-[13px] text-gray-600">
                  智能防跟踪功能保护您的浏览隐私
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                  性能卓越
                </h3>
                <p className="text-[13px] text-gray-600">
                  更快的页面加载速度和更流畅的浏览体验
                </p>
              </div>

              <div className="p-6 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-purple-400 rounded-lg flex items-center justify-center mb-3 shadow-sm">
                  <Battery className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">
                  节能高效
                </h3>
                <p className="text-[13px] text-gray-600">
                  优化的能效管理延长电池续航时间
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
