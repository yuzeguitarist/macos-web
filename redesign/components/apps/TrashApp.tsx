"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trash2, RotateCcw, FileText, Folder, AlertCircle } from "lucide-react"
import { useFileSystemStore } from "@/store/useFileSystemStore"

export function TrashApp() {
  const { trashedFiles, restoreFile, permanentlyDeleteFile, emptyTrash } = useFileSystemStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)

  const handleSelectItem = (name: string) => {
    setSelectedItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === trashedFiles.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(trashedFiles.map((f) => f.name))
    }
  }

  const handleRestoreSelected = () => {
    selectedItems.forEach((name) => {
      restoreFile(name)
    })
    setSelectedItems([])
  }

  const handleDeleteSelected = () => {
    selectedItems.forEach((name) => {
      permanentlyDeleteFile(name)
    })
    setSelectedItems([])
  }

  const handleEmptyTrash = () => {
    emptyTrash()
    setSelectedItems([])
    setShowEmptyConfirm(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-12 vibrancy-toolbar border-b border-black/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            disabled={trashedFiles.length === 0}
            className={cn(
              "px-3 py-1 text-[13px] rounded-md transition-colors",
              trashedFiles.length === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200/50"
            )}
          >
            {selectedItems.length === trashedFiles.length && trashedFiles.length > 0
              ? "取消全选"
              : "全选"}
          </button>

          <button
            onClick={handleRestoreSelected}
            disabled={selectedItems.length === 0}
            className={cn(
              "flex items-center gap-2 px-3 py-1 text-[13px] rounded-md transition-colors",
              selectedItems.length === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            还原
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className={cn(
              "px-3 py-1 text-[13px] rounded-md transition-colors",
              selectedItems.length === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:bg-red-50"
            )}
          >
            永久删除
          </button>
        </div>

        <button
          onClick={() => setShowEmptyConfirm(true)}
          disabled={trashedFiles.length === 0}
          className={cn(
            "px-4 py-1 text-[13px] rounded-md transition-colors",
            trashedFiles.length === 0
              ? "text-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          )}
        >
          清空废纸篓
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {trashedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">废纸篓为空</h2>
            <p className="text-gray-600 text-center max-w-md">
              删除的文件会在这里显示，你可以随时还原或永久删除它们。
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {trashedFiles.map((file) => {
              const isSelected = selectedItems.includes(file.name)
              const Icon = file.type === "folder" ? Folder : FileText

              return (
                <div
                  key={file.name}
                  onClick={() => handleSelectItem(file.name)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                    isSelected
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        file.type === "folder" ? "text-blue-500" : "text-gray-500"
                      )}
                    />
                    <div>
                      <div className="text-[14px] font-medium text-gray-900">
                        {file.title}
                      </div>
                      <div className="text-[12px] text-gray-500">
                        删除于 {new Date(file.modifiedAt).toLocaleString("zh-CN")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        restoreFile(file.name)
                      }}
                      className="p-2 hover:bg-blue-100 rounded-md transition-colors"
                      title="还原"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        permanentlyDeleteFile(file.name)
                      }}
                      className="p-2 hover:bg-red-100 rounded-md transition-colors"
                      title="永久删除"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Empty Trash Confirmation Dialog */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]">
          <div className="vibrancy-menu rounded-2xl shadow-2xl p-6 max-w-md border border-black/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  确定要清空废纸篓吗？
                </h3>
                <p className="text-[13px] text-gray-600">
                  此操作将永久删除 {trashedFiles.length} 个项目，且无法撤销。
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmptyConfirm(false)}
                className="px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 text-[13px] bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                清空废纸篓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
