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
  const [currentDir, setCurrentDir] = useState("~")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [lines])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Add to history
    setHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    setLines((prev) => [...prev, { type: "command", content: trimmed }])

    let output = ""
    const parts = trimmed.split(" ")
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case "help":
        output = `Available commands:
  help        - Show this help message
  clear       - Clear the terminal
  date        - Show current date and time
  echo <msg>  - Echo a message
  ls [dir]    - List files in directory
  pwd         - Print working directory
  whoami      - Display current user
  cd <dir>    - Change directory
  cat <file>  - Display file contents
  mkdir <dir> - Create directory
  touch <file>- Create empty file
  rm <file>   - Remove file
  uname       - System information
  uptime      - System uptime
  history     - Show command history
  cal         - Show calendar
  tree        - Display directory tree
  ps          - Show running processes
  man <cmd>   - Show manual for command`
        break
      case "clear":
        setLines([])
        setCurrentCommand("")
        return
      case "date":
        output = new Date().toLocaleString('zh-CN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        break
      case "pwd":
        output = currentDir === "~" ? "/Users/guest" : `/Users/guest/${currentDir.replace("~/", "")}`
        break
      case "whoami":
        output = "guest"
        break
      case "ls":
        if (args[0] === "-la" || args[0] === "-l") {
          output = `total 40
drwxr-xr-x  7 guest  staff   224  ${new Date().toLocaleDateString()}  .
drwxr-xr-x  3 root   admin    96  ${new Date().toLocaleDateString()}  ..
drwxr-xr-x  5 guest  staff   160  ${new Date().toLocaleDateString()}  Documents
drwxr-xr-x  3 guest  staff    96  ${new Date().toLocaleDateString()}  Downloads
drwxr-xr-x  4 guest  staff   128  ${new Date().toLocaleDateString()}  Desktop
drwxr-xr-x  6 guest  staff   192  ${new Date().toLocaleDateString()}  Pictures
drwxr-xr-x  4 guest  staff   128  ${new Date().toLocaleDateString()}  Music`
        } else {
          output = "Documents  Downloads  Desktop  Pictures  Music  Videos"
        }
        break
      case "cd":
        if (!args[0] || args[0] === "~") {
          setCurrentDir("~")
          output = ""
        } else if (args[0] === "..") {
          const parts = currentDir.split("/")
          if (parts.length > 1) {
            parts.pop()
            setCurrentDir(parts.join("/") || "~")
          }
          output = ""
        } else {
          setCurrentDir(currentDir === "~" ? `~/${args[0]}` : `${currentDir}/${args[0]}`)
          output = ""
        }
        break
      case "cat":
        if (!args[0]) {
          output = "cat: missing file operand"
        } else {
          output = `# ${args[0]}
This is a sample file in the macOS terminal simulator.
You can view file contents using the cat command.

Sample content for demonstration purposes.`
        }
        break
      case "mkdir":
        output = args[0] ? `Created directory: ${args[0]}` : "mkdir: missing operand"
        break
      case "touch":
        output = args[0] ? `Created file: ${args[0]}` : "touch: missing file operand"
        break
      case "rm":
        output = args[0] ? `Removed: ${args[0]}` : "rm: missing operand"
        break
      case "uname":
        output = args[0] === "-a"
          ? "Darwin macOS 14.0 Darwin Kernel Version 23.0.0 x86_64"
          : "Darwin"
        break
      case "uptime":
        output = `${new Date().toLocaleTimeString()} up 2 days, 5:42, 1 user, load averages: 1.23 1.45 1.67`
        break
      case "history":
        output = history.map((cmd, i) => `  ${i + 1}  ${cmd}`).join("\n")
        break
      case "cal": {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const today = now.getDate()

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Build calendar header
        const monthName = now.toLocaleString('zh-CN', { month: 'long', year: 'numeric' })
        let cal = `     ${monthName}\n日 一 二 三 四 五 六\n`

        // Add leading spaces
        let line = ''
        for (let i = 0; i < firstDay; i++) {
          line += '   '
        }

        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
          const dayStr = day.toString().padStart(2, ' ')
          line += dayStr + ' '

          if ((firstDay + day) % 7 === 0) {
            cal += line + '\n'
            line = ''
          }
        }

        // Add remaining days
        if (line) {
          cal += line
        }

        output = cal
        break
      }
      case "tree": {
        output = `.
├── Documents
│   ├── work
│   └── personal
├── Downloads
├── Desktop
│   ├── projects
│   └── notes.txt
├── Pictures
│   └── screenshots
└── Music
    └── library`
        break
      }
      case "ps":
        output = `  PID TTY           TIME CMD
  501 ttys000    0:00.12 -zsh
 1234 ttys000    0:00.05 Terminal
 5678 ttys000    0:01.23 Safari
 9012 ttys000    0:00.08 Finder`
        break
      case "man":
        if (!args[0]) {
          output = "What manual page do you want?\nFor example, try: man ls"
        } else {
          output = `${args[0].toUpperCase()}(1)

NAME
     ${args[0]} - ${args[0]} command

SYNOPSIS
     ${args[0]} [options] [arguments]

DESCRIPTION
     The ${args[0]} command performs various operations.
     Use 'help' to see all available commands.

SEE ALSO
     help(1), man(1)`
        }
        break
      default:
        if (trimmed.startsWith("echo ")) {
          output = trimmed.substring(5)
        } else {
          output = `zsh: command not found: ${trimmed}`
        }
    }

    if (output) {
      setLines((prev) => [...prev, { type: "output", content: output }])
    }
    setCurrentCommand("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentCommand(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setCurrentCommand("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentCommand(history[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion
      const commands = ["help", "clear", "date", "echo", "ls", "pwd", "whoami", "cd", "cat", "mkdir", "touch", "rm", "uname", "uptime", "history", "cal", "tree", "ps", "man"]
      const match = commands.find(cmd => cmd.startsWith(currentCommand.toLowerCase()))
      if (match) {
        setCurrentCommand(match)
      }
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
        <span className="text-white">{currentDir}</span>
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
