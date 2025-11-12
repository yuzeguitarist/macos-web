import { create } from "zustand"
import { FileSystemItem } from "@/lib/types"

interface FileSystemStore {
  files: FileSystemItem[]
  addFile: (file: FileSystemItem) => void
  updateFile: (name: string, content: string) => void
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
]

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  files: initialFiles,

  addFile: (file) => {
    set((state) => ({
      files: [...state.files, file],
    }))
  },

  updateFile: (name, content) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.name === name
          ? { ...f, content, modifiedAt: new Date() }
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
