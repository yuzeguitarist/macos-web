"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, RotateCw, Home, Search, Globe, Shield, Zap, Battery, FileText, ExternalLink } from "lucide-react"
import { useFileSystemStore } from "@/store/useFileSystemStore"

// Predefined web pages
const predefinedPages: Record<string, string> = {
  "apple.com": `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Apple (中国大陆)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; background: #fff; }
    .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center; }
    .hero h1 { font-size: 56px; font-weight: 600; margin: 0 0 20px; }
    .hero p { font-size: 28px; margin: 0 0 30px; opacity: 0.9; }
    .hero button { background: white; color: #667eea; border: none; padding: 16px 40px; font-size: 18px; border-radius: 30px; cursor: pointer; font-weight: 600; }
    .products { max-width: 1200px; margin: 80px auto; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
    .product { text-align: center; }
    .product img { width: 100%; max-width: 300px; }
    .product h3 { font-size: 32px; margin: 20px 0 10px; }
    .product p { color: #666; font-size: 18px; }
    .footer { background: #f5f5f7; padding: 40px 20px; text-align: center; color: #666; margin-top: 80px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>iPhone 15 Pro</h1>
    <p>钛金属。超能力。超Pro。</p>
    <button>进一步了解</button>
  </div>
  <div class="products">
    <div class="product">
      <div style="width: 200px; height: 200px; margin: 0 auto; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 20px;"></div>
      <h3>iPhone 15</h3>
      <p>新一代 iPhone</p>
    </div>
    <div class="product">
      <div style="width: 200px; height: 200px; margin: 0 auto; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 20px;"></div>
      <h3>MacBook Pro</h3>
      <p>性能进化 M3 芯片</p>
    </div>
    <div class="product">
      <div style="width: 200px; height: 200px; margin: 0 auto; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 20px;"></div>
      <h3>iPad Pro</h3>
      <p>终极 iPad 体验</p>
    </div>
  </div>
  <div class="footer">
    <p>这是一个模拟的 Apple 网站页面</p>
    <p>© 2024 Apple Inc. 保留所有权利</p>
  </div>
</body>
</html>`,
  "google.com": `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Google</title>
  <style>
    body { margin: 0; font-family: arial, sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
    .header { padding: 20px; text-align: right; }
    .header a { margin-left: 15px; color: #000; text-decoration: none; font-size: 13px; }
    .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -100px; }
    .logo { font-size: 92px; font-weight: bold; background: linear-gradient(to right, #4285f4, #ea4335, #fbbc04, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .search-box { margin: 30px 0; width: 584px; }
    .search-box input { width: 100%; padding: 12px 16px; font-size: 16px; border: 1px solid #dfe1e5; border-radius: 24px; }
    .search-box input:focus { outline: none; box-shadow: 0 1px 6px rgba(32,33,36,.28); border-color: transparent; }
    .buttons { margin-top: 20px; }
    .buttons button { margin: 0 4px; padding: 10px 16px; border: none; background: #f8f9fa; color: #3c4043; font-size: 14px; border-radius: 4px; cursor: pointer; }
    .buttons button:hover { box-shadow: 0 1px 1px rgba(0,0,0,.1); border: 1px solid #dadce0; }
  </style>
</head>
<body>
  <div class="header">
    <a href="#">Gmail</a>
    <a href="#">图片</a>
  </div>
  <div class="main">
    <div class="logo">Google</div>
    <div class="search-box">
      <input type="text" placeholder="在 Google 上搜索，或者输入网址">
    </div>
    <div class="buttons">
      <button>Google 搜索</button>
      <button>手气不错</button>
    </div>
  </div>
</body>
</html>`,
  "github.com": `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GitHub</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d1117; color: #c9d1d9; }
    header { background: #161b22; border-bottom: 1px solid #30363d; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 32px; font-weight: bold; color: #fff; }
    nav a { color: #c9d1d9; text-decoration: none; margin-left: 24px; }
    .hero { text-align: center; padding: 100px 20px; }
    .hero h1 { font-size: 64px; font-weight: 600; margin-bottom: 24px; background: linear-gradient(to right, #58a6ff, #bc8cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 24px; color: #8b949e; margin-bottom: 32px; }
    .hero button { background: linear-gradient(to right, #58a6ff, #bc8cff); border: none; padding: 16px 40px; font-size: 18px; border-radius: 6px; color: white; cursor: pointer; font-weight: 600; }
    .features { max-width: 1200px; margin: 80px auto; padding: 0 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    .feature { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 32px; }
    .feature h3 { color: #58a6ff; font-size: 24px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <header>
    <div class="logo">GitHub</div>
    <nav>
      <a href="#">产品</a>
      <a href="#">解决方案</a>
      <a href="#">开源</a>
      <a href="#">定价</a>
    </nav>
  </header>
  <div class="hero">
    <h1>让我们一起构建未来</h1>
    <p>全球开发者的家园</p>
    <button>开始使用 GitHub</button>
  </div>
  <div class="features">
    <div class="feature">
      <h3>协作开发</h3>
      <p>与团队成员实时协作，共同构建优秀的软件项目</p>
    </div>
    <div class="feature">
      <h3>代码审查</h3>
      <p>通过 Pull Request 进行代码审查，确保代码质量</p>
    </div>
    <div class="feature">
      <h3>CI/CD</h3>
      <p>自动化构建、测试和部署，提高开发效率</p>
    </div>
  </div>
</body>
</html>`,
}

export function BrowserApp() {
  const { files } = useFileSystemStore()
  const htmlFiles = files.filter((f) => f.type === "html")

  const [history, setHistory] = useState<string[]>(["home"])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputUrl, setInputUrl] = useState("home")

  const url = history[currentIndex]
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < history.length - 1

  // Check if current URL is an HTML file or predefined page
  const currentHtmlFile = htmlFiles.find(
    (f) => f.name === url || f.title === url || url.includes(f.name)
  )

  // Normalize URL: remove protocol, www, trailing slashes and paths
  const normalizeUrl = (rawUrl: string) => {
    return rawUrl
      .replace(/^(https?:\/\/)?(www\.)?/, '')  // Remove protocol and www
      .replace(/\/.*$/, '')                     // Remove path and trailing slash
  }

  const currentPredefinedPage = predefinedPages[url] || predefinedPages[normalizeUrl(url)]

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
        ) : currentPredefinedPage ? (
          // Display predefined web page
          <iframe
            srcDoc={currentPredefinedPage}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-forms allow-modals"
            title={url}
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

              {/* Quick Access Sites */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  快速访问
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.keys(predefinedPages).map((site) => (
                    <button
                      key={site}
                      onClick={() => handleNavigate(site)}
                      className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors group"
                    >
                      <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow">
                        <ExternalLink className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="text-[15px] font-medium text-gray-700">{site}</div>
                    </button>
                  ))}
                </div>
              </div>

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
