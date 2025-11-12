"use client"

import { useState, useEffect, useRef } from "react"
import { useFileSystemStore } from "@/store/useFileSystemStore"
import { cn } from "@/lib/utils"
import { Plus, FileText } from "lucide-react"

export function NotesApp() {
  const { files, updateFile, addFile } = useFileSystemStore()
  const notes = files.filter((f) => f.type === "note")
  const [selectedNote, setSelectedNote] = useState(notes[0]?.name || "")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const contentTimerRef = useRef<NodeJS.Timeout | null>(null)
  const titleTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (selectedNote) {
      const note = notes.find((n) => n.name === selectedNote)
      if (note) {
        setTitle(note.title)
        setContent(note.content || "")
      }
    }
  }, [selectedNote, notes])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)

    // Clear previous timer
    if (contentTimerRef.current) {
      clearTimeout(contentTimerRef.current)
    }

    // Auto-save after 300ms
    contentTimerRef.current = setTimeout(() => {
      if (selectedNote) {
        updateFile(selectedNote, { content: newContent })
      }
    }, 300)
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)

    // Clear previous timer
    if (titleTimerRef.current) {
      clearTimeout(titleTimerRef.current)
    }

    // Auto-save after 300ms
    titleTimerRef.current = setTimeout(() => {
      if (selectedNote) {
        updateFile(selectedNote, { title: newTitle })
      }
    }, 300)
  }

  const createNewNote = () => {
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
  }

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-64 vibrancy-sidebar border-r border-black/5 flex flex-col">
        <div className="h-11 border-b border-black/5 flex items-center justify-between px-4">
          <span className="text-[13px] font-semibold text-gray-700">
            备忘录
          </span>
          <button
            onClick={createNewNote}
            className="p-1 hover:bg-gray-200/50 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
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
                <FileText className="w-4 h-4 flex-shrink-0" />
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
            <div className="p-6 pb-0">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold text-gray-900 outline-none mb-4"
                placeholder="标题"
              />
            </div>
            <div className="flex-1 p-6 pt-2">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full bg-transparent text-[15px] text-gray-700 outline-none resize-none leading-relaxed"
                placeholder="开始输入..."
              />
            </div>
            <div className="h-8 px-6 flex items-center text-[11px] text-gray-500">
              已自动保存
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            选择或创建一个备忘录
          </div>
        )}
      </div>
    </div>
  )
}
