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
  <title>Apple</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      background: #000;
      color: #fff;
      -webkit-font-smoothing: antialiased;
    }

    /* Header */
    header {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    nav {
      max-width: 980px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 22px;
    }
    .logo {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    nav a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 12px;
      margin-left: 32px;
      transition: color 0.3s;
    }
    nav a:hover { color: #fff; }

    /* Hero Section */
    .hero {
      text-align: center;
      padding: 120px 20px 80px;
      background: #000;
    }
    .hero h1 {
      font-size: 96px;
      font-weight: 700;
      letter-spacing: -3px;
      margin-bottom: 8px;
      background: linear-gradient(180deg, #fff 0%, #999 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero .tagline {
      font-size: 32px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 120px;
      letter-spacing: -0.5px;
    }

    /* Content Sections */
    .section {
      max-width: 1200px;
      margin: 0 auto 160px;
      padding: 0 40px;
    }
    .section h2 {
      font-size: 64px;
      font-weight: 700;
      letter-spacing: -2px;
      margin-bottom: 16px;
      color: #fff;
    }
    .section h3 {
      font-size: 40px;
      font-weight: 600;
      letter-spacing: -1px;
      margin-bottom: 24px;
      color: rgba(255, 255, 255, 0.9);
    }
    .section p {
      font-size: 21px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.7);
      max-width: 800px;
      margin-bottom: 16px;
    }

    /* Image Placeholder */
    .image-placeholder {
      width: 100%;
      height: 600px;
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      border-radius: 24px;
      margin: 60px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .image-placeholder svg {
      width: 200px;
      height: 200px;
      opacity: 0.15;
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin: 80px 0;
    }
    .grid-item {
      background: #0a0a0a;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 60px 40px;
    }
    .grid-item h4 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #fff;
    }
    .grid-item p {
      font-size: 17px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.6);
    }

    /* Footer */
    footer {
      background: #000;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
      margin-top: 160px;
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">Apple</div>
      <div>
        <a href="#">iPhone</a>
        <a href="#">Mac</a>
        <a href="#">iPad</a>
        <a href="#">Watch</a>
      </div>
    </nav>
  </header>

  <div class="hero">
    <h1>iPhone 17 Pro</h1>
    <p class="tagline">All out Pro.</p>
  </div>

  <section class="section">
    <h2>Design</h2>
    <h3>Unibody enclosure.<br>Makes a strong case for itself.</h3>
    <p>
      Introducing iPhone 17 Pro and iPhone 17 Pro Max, designed from the inside out to be the most powerful iPhone models ever made. At the core of the new design is a heat-forged aluminum unibody enclosure that maximizes performance, battery capacity, and durability.
    </p>
    <div class="image-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12" y2="18"></line>
      </svg>
    </div>
  </section>

  <section class="section">
    <h2>Cameras</h2>
    <h3>A big zoom forward.</h3>
    <p>
      Across the iPhone 17 Pro camera system, you'll find innovation that goes to great lengths. The telephoto features the next generation of our tetraprism design and a 56 percent larger sensor.
    </p>
    <p>
      With an equivalent 200 mm focal length, the 8x optical-quality zoom makes this the longest iPhone Telephoto ever — offering 16x total optical zoom range. So you can explore an even wider range of creative choices and add a longer reach to your compositions.
    </p>
    <div class="image-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
    </div>
  </section>

  <section class="section">
    <div class="grid">
      <div class="grid-item">
        <h4>Performance</h4>
        <p>A18 Pro chip delivers unprecedented power and efficiency for pro workflows.</p>
      </div>
      <div class="grid-item">
        <h4>Display</h4>
        <p>ProMotion technology with adaptive refresh rates up to 120Hz.</p>
      </div>
      <div class="grid-item">
        <h4>Battery</h4>
        <p>All-day battery life engineered for professional use.</p>
      </div>
      <div class="grid-item">
        <h4>Materials</h4>
        <p>Aerospace-grade titanium construction for durability.</p>
      </div>
    </div>
  </section>

  <footer>
    <p>This is an educational demonstration page, not an official Apple Inc. website</p>
    <p>For educational and demonstration purposes only, not affiliated with Apple Inc.</p>
  </footer>
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
