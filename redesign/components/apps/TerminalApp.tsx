"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

export function TerminalApp() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "macOS Terminal v2.0" },
    { type: "output", content: 'Type "help" for available commands.' },
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    setLines((prev) => [...prev, { type: "command", content: trimmed }])

    let output = ""

    switch (trimmed.toLowerCase()) {
      case "help":
        output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  date     - Show current date and time
  echo     - Echo a message
  ls       - List files
  pwd      - Print working directory
  whoami   - Display current user`
        break
      case "clear":
        setLines([])
        setCurrentCommand("")
        return
      case "date":
        output = new Date().toString()
        break
      case "pwd":
        output = "/Users/guest"
        break
      case "whoami":
        output = "guest"
        break
      case "ls":
        output = "Documents  Downloads  Desktop  Pictures  Music"
        break
      default:
        if (trimmed.startsWith("echo ")) {
          output = trimmed.substring(5)
        } else {
          output = `zsh: command not found: ${trimmed}`
        }
    }

    setLines((prev) => [...prev, { type: "output", content: output }])
    setCurrentCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
    }
  }

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-[13px] p-4 overflow-auto"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, index) => (
        <div key={index} className="mb-1">
          {line.type === "command" && (
            <div className="flex gap-2">
              <span className="text-cyan-400">guest@macos</span>
              <span className="text-white">~</span>
              <span className="text-yellow-400">$</span>
              <span className="text-white">{line.content}</span>
            </div>
          )}
          {line.type === "output" && (
            <pre className="whitespace-pre-wrap text-green-400">
              {line.content}
            </pre>
          )}
          {line.type === "error" && (
            <pre className="whitespace-pre-wrap text-red-400">{line.content}</pre>
          )}
        </div>
      ))}

      {/* Input Line */}
      <div className="flex gap-2">
        <span className="text-cyan-400">guest@macos</span>
        <span className="text-white">~</span>
        <span className="text-yellow-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white"
          autoFocus
        />
      </div>
    </div>
  )
}
