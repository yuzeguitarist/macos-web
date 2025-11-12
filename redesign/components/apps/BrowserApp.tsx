"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, RotateCw, Home, Search, Globe, Shield, Zap, Battery, FileText } from "lucide-react"
import { useFileSystemStore } from "@/store/useFileSystemStore"

export function BrowserApp() {
  const { files } = useFileSystemStore()
  const htmlFiles = files.filter((f) => f.type === "html")

  const [history, setHistory] = useState<string[]>(["home"])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputUrl, setInputUrl] = useState("home")

  const url = history[currentIndex]
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < history.length - 1

  // Check if current URL is an HTML file
  const currentHtmlFile = htmlFiles.find(
    (f) => f.name === url || f.title === url || url.includes(f.name)
  )

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
    handleNavigate("home")
  }

  const handleQuickLink = (site: { name: string; url: string }) => {
    // Check if it's an HTML file
    const htmlFile = htmlFiles.find((f) => f.name === site.url || f.title.includes(site.name))
    if (htmlFile) {
      handleNavigate(htmlFile.name)
    } else {
      handleNavigate(site.url)
    }
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
        {currentHtmlFile ? (
          // Display HTML file content
          <iframe
            srcDoc={currentHtmlFile.content}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-forms allow-modals"
            title={currentHtmlFile.title}
          />
        ) : url === "home" ? (
          // Home page
          <div className="max-w-4xl mx-auto p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">欢迎使用 Safari</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                在地址栏输入 HTML 文件名来访问您创建的网页，或浏览下方的快捷链接。
              </p>

              {/* HTML Files */}
              {htmlFiles.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    我的网页
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    {htmlFiles.map((file) => (
                      <button
                        key={file.name}
                        onClick={() => handleNavigate(file.name)}
                        className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors group"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow">
                          <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-[13px] font-medium text-gray-700 truncate">
                          {file.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links - Only show if we have a demo HTML file */}
              {htmlFiles.length === 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    开始创建
                  </h2>
                  <div className="max-w-md mx-auto p-8 rounded-xl bg-gray-50">
                    <p className="text-gray-600 text-center mb-4">
                      打开备忘录应用，创建你的第一个 HTML 文件，然后在这里访问它。
                    </p>
                    <div className="text-[13px] text-gray-500 text-center">
                      点击备忘录中的 + 按钮 → 选择 HTML
                    </div>
                  </div>
                </div>
              )}

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
        ) : (
          // 404 page
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Globe className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                找不到页面
              </h2>
              <p className="text-gray-600 mb-6">
                无法访问 &quot;{url}&quot;
              </p>
              <button
                onClick={handleHome}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                返回主页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
