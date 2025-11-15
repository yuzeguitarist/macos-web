export interface PredefinedSite {
  domain: string
  title: string
  description: string
  content: string
}

export const predefinedPages: Record<string, PredefinedSite> = {
  "apple.com": {
    domain: "apple.com",
    title: "Apple",
    description: "官方网站",
    content: `<!DOCTYPE html>
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
    <p style="color: #999; font-weight: 600;">这是一个教育演示页面，非 Apple Inc. 官方网站</p>
    <p>仅用于学习和演示目的，与 Apple Inc. 无任何关联</p>
  </div>
</body>
</html>`,
  },
  "google.com": {
    domain: "google.com",
    title: "Google",
    description: "搜索引擎",
    content: `<!DOCTYPE html>
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
    .footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 12px; color: #999; }
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
  <div class="footer">
    <p style="font-weight: 600;">这是一个教育演示页面，非 Google LLC 官方网站</p>
    <p>仅用于学习和演示目的，与 Google LLC 无任何关联</p>
  </div>
</body>
</html>`,
  },
  "github.com": {
    domain: "github.com",
    title: "GitHub",
    description: "开发者平台",
    content: `<!DOCTYPE html>
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
    .footer { text-align: center; padding: 40px 20px; color: #8b949e; font-size: 12px; }
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
  <div class="footer">
    <p style="font-weight: 600;">这是一个教育演示页面，非 GitHub, Inc. 官方网站</p>
    <p>仅用于学习和演示目的，与 GitHub, Inc. 无任何关联</p>
  </div>
</body>
</html>`,
  },
}
