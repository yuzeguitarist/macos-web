"use client"

import { useState, useEffect, useRef } from "react"
import { useFileSystemStore } from "@/store/useFileSystemStore"
import { cn } from "@/lib/utils"
import { Plus, FileText, Code2, Eye, EyeOff } from "lucide-react"

export function NotesApp() {
  const { files, updateFile, addFile } = useFileSystemStore()
  const notes = files.filter((f) => f.type === "note" || f.type === "html")
  const [selectedNote, setSelectedNote] = useState(notes[0]?.name || "")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const contentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isEditingRef = useRef(false)

  const selectedFile = notes.find((n) => n.name === selectedNote)
  const isHtmlFile = selectedFile?.type === "html"

  // Only load note content when switching notes, not when store updates
  useEffect(() => {
    if (selectedNote && !isEditingRef.current) {
      const note = notes.find((n) => n.name === selectedNote)
      if (note) {
        setTitle(note.title)
        setContent(note.content || "")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNote])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    isEditingRef.current = true

    // Clear previous timer
    if (contentTimerRef.current) {
      clearTimeout(contentTimerRef.current)
    }

    // Auto-save after 500ms
    contentTimerRef.current = setTimeout(() => {
      if (selectedNote) {
        updateFile(selectedNote, { content: newContent })
        isEditingRef.current = false
      }
    }, 500)
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    isEditingRef.current = true

    // Clear previous timer
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current)
    }

    // Auto-save after 500ms
    titleTimerRef.current = setTimeout(() => {
      if (selectedNote) {
        updateFile(selectedNote, { title: newTitle })
        isEditingRef.current = false
      }
    }, 500)
  }

  const createNewNote = () => {
    isEditingRef.current = false
    const newNote = {
      name: `note-${Date.now()}`,
      type: "note" as const,
      title: "新建备忘录",
      content: "",
      createdAt: new Date(),
      modifiedAt: new Date(),
    }
    addFile(newNote)
    setSelectedNote(newNote.name)
    setTitle(newNote.title)
    setContent(newNote.content)
    setCreateMenuOpen(false)
  }

  const createNewHtml = () => {
    isEditingRef.current = false
    const newHtml = {
      name: `html-${Date.now()}`,
      type: "html" as const,
      title: "新建网页.html",
      content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>新建网页</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 20px;
    }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>开始编辑你的网页...</p>
</body>
</html>`,
      createdAt: new Date(),
      modifiedAt: new Date(),
    }
    addFile(newHtml)
    setSelectedNote(newHtml.name)
    setTitle(newHtml.title)
    setContent(newHtml.content)
    setCreateMenuOpen(false)
  }

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-64 vibrancy-sidebar border-r border-black/5 flex flex-col">
        <div className="h-11 border-b border-black/5 flex items-center justify-between px-4">
          <span className="text-[13px] font-semibold text-gray-700">
            文件
          </span>
          <div className="relative">
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              className="p-1 hover:bg-gray-200/50 rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
            {createMenuOpen && (
              <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={createNewNote}
                  className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-gray-100 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  备忘录
                </button>
                <button
                  onClick={createNewHtml}
                  className="w-full px-3 py-1.5 text-left text-[13px] hover:bg-gray-100 flex items-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  HTML
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2 space-y-1">
          {notes.map((note) => {
            const preview = note.content || ""
            const showEllipsis = preview.length > 30
            return (
              <button
                key={note.name}
                onClick={() => setSelectedNote(note.name)}
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors",
                  selectedNote === note.name
                    ? "bg-blue-400 text-white"
                    : "hover:bg-gray-200/50 text-gray-700"
                )}
              >
                {note.type === "html" ? (
                  <Code2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">
                    {note.title}
                  </div>
                  <div className="text-[11px] opacity-70 truncate">
                    {showEllipsis ? preview.substring(0, 30) + "..." : preview}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="h-11 border-b border-black/5 flex items-center justify-between px-4">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="flex-1 bg-transparent text-[13px] font-semibold text-gray-900 outline-none"
                placeholder="标题"
              />
              {isHtmlFile && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-1 hover:bg-gray-200/50 rounded transition-colors flex items-center gap-1.5 text-[12px] text-gray-600"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      编辑
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      预览
                    </>
                  )}
                </button>
              )}
            </div>

            {isHtmlFile && showPreview ? (
              <div className="flex-1 bg-white overflow-auto">
                <iframe
                  srcDoc={content}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                  title="HTML Preview"
                />
              </div>
            ) : (
              <div className="flex-1 p-6">
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className={cn(
                    "w-full h-full bg-transparent outline-none resize-none leading-relaxed",
                    isHtmlFile ? "font-mono text-[13px] text-gray-800" : "text-[15px] text-gray-700"
                  )}
                  placeholder={isHtmlFile ? "输入 HTML 代码..." : "开始输入..."}
                />
              </div>
            )}

            <div className="h-8 px-6 flex items-center justify-between text-[11px] text-gray-500">
              <span>已自动保存</span>
              {isHtmlFile && <span className="text-blue-500">HTML 文件</span>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            选择或创建一个文件
          </div>
        )}
      </div>
    </div>
  )
}
