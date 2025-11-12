import { create } from "zustand"
import { FileSystemItem } from "@/lib/types"

interface FileSystemStore {
  files: FileSystemItem[]
  addFile: (file: FileSystemItem) => void
  updateFile: (name: string, updates: Partial<Pick<FileSystemItem, 'content' | 'title'>>) => void
  deleteFile: (name: string) => void
  getFile: (name: string) => FileSystemItem | undefined
}

const initialFiles: FileSystemItem[] = [
  {
    name: "welcome-note",
    type: "note",
    title: "欢迎使用备忘录",
    content: `# 欢迎使用 macOS 备忘录

这是一个现代化的 macOS 风格备忘录应用。

## 特性
- 实时自动保存
- 流畅的动画效果
- 优雅的磨砂玻璃设计
- 完整的 markdown 支持

开始创建你的第一个笔记吧！`,
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    name: "todo-note",
    type: "note",
    title: "今日待办",
    content: `# 今日待办事项

## 工作
- [ ] 完成项目重构
- [ ] 代码审查
- [ ] 更新文档

## 生活
- [ ] 锻炼30分钟
- [ ] 阅读技术文章
- [ ] 学习新技术

保持专注，高效完成！`,
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    name: "demo-html",
    type: "html",
    title: "示例网页.html",
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例网页</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    h1 { font-size: 2.5em; margin-bottom: 20px; }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 30px;
      margin: 20px 0;
    }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
    }
    button:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <h1>🎨 欢迎来到 HTML 编辑器</h1>
  <div class="card">
    <h2>功能特性</h2>
    <ul>
      <li>创建和编辑 HTML 文件</li>
      <li>实时预览网页效果</li>
      <li>支持 CSS 样式和 JavaScript</li>
      <li>现代化的代码编辑体验</li>
    </ul>
    <button onclick="alert('Hello from HTML!')">点击测试</button>
  </div>
</body>
</html>`,
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
]

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  files: initialFiles,

  addFile: (file) => {
    set((state) => ({
      files: [...state.files, file],
    }))
  },

  updateFile: (name, updates) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.name === name
          ? { ...f, ...updates, modifiedAt: new Date() }
          : f
      ),
    }))
  },

  deleteFile: (name) => {
    set((state) => ({
      files: state.files.filter((f) => f.name !== name),
    }))
  },

  getFile: (name) => {
    return get().files.find((f) => f.name === name)
  },
}))
