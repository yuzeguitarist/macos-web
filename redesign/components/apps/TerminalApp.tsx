"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useFileSystemStore } from "@/store/useFileSystemStore"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

export function TerminalApp() {
  const { files, addFile, deleteFile, getFile } = useFileSystemStore()
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
  rm <file>   - Remove file (move to trash)
  uname       - System information
  uptime      - System uptime
  history     - Show command history
  cal         - Show calendar
  tree        - Display directory tree
  ps          - Show running processes
  man <cmd>   - Show manual for command
  find <name> - Find files by name
  wc <file>   - Word count
  grep <text> - Search in files`
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
          const fileList = files.map(f => {
            const date = new Date(f.modifiedAt).toLocaleDateString()
            const type = f.type === "folder" ? "drwxr-xr-x" : "-rw-r--r--"
            const size = f.content ? f.content.length : 0
            return `${type}  1 guest  staff   ${size.toString().padStart(6)}  ${date}  ${f.title}`
          }).join("\n")
          output = `total ${files.length}\n${fileList}`
        } else {
          output = files.map(f => f.title).join("  ")
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
          const file = files.find(f => f.title === args[0] || f.name === args[0])
          if (file) {
            output = file.content || `File: ${file.title}\nType: ${file.type}`
          } else {
            output = `cat: ${args[0]}: No such file`
          }
        }
        break
      case "mkdir":
        output = args[0] ? `Created directory: ${args[0]}` : "mkdir: missing operand"
        break
      case "touch":
        output = args[0] ? `Created file: ${args[0]}` : "touch: missing file operand"
        break
      case "rm":
        if (!args[0]) {
          output = "rm: missing operand"
        } else {
          const file = files.find(f => f.title === args[0] || f.name === args[0])
          if (file) {
            deleteFile(file.name)
            output = `Removed: ${args[0]} (moved to trash)`
          } else {
            output = `rm: ${args[0]}: No such file`
          }
        }
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
      case "find":
        if (!args[0]) {
          output = "find: missing search term"
        } else {
          const searchTerm = args[0].toLowerCase()
          const matches = files.filter(f =>
            f.title.toLowerCase().includes(searchTerm) ||
            f.name.toLowerCase().includes(searchTerm)
          )
          if (matches.length > 0) {
            output = matches.map(f => `./${f.title}`).join("\n")
          } else {
            output = `find: no files matching '${args[0]}'`
          }
        }
        break
      case "wc":
        if (!args[0]) {
          output = "wc: missing file operand"
        } else {
          const file = files.find(f => f.title === args[0] || f.name === args[0])
          if (file && file.content) {
            const lines = file.content.split("\n").length
            const words = file.content.split(/\s+/).length
            const chars = file.content.length
            output = `  ${lines}  ${words}  ${chars}  ${file.title}`
          } else if (file) {
            output = `wc: ${args[0]}: file has no content`
          } else {
            output = `wc: ${args[0]}: No such file`
          }
        }
        break
      case "grep":
        if (!args[0]) {
          output = "grep: missing search pattern"
        } else {
          const searchPattern = args[0].toLowerCase()
          const results: string[] = []
          files.forEach(f => {
            if (f.content && f.content.toLowerCase().includes(searchPattern)) {
              const lines = f.content.split("\n")
              lines.forEach((line, idx) => {
                if (line.toLowerCase().includes(searchPattern)) {
                  results.push(`${f.title}:${idx + 1}: ${line}`)
                }
              })
            }
          })
          output = results.length > 0
            ? results.slice(0, 10).join("\n") + (results.length > 10 ? `\n... and ${results.length - 10} more matches` : "")
            : `grep: no matches for '${args[0]}'`
        }
        break
      case "open":
        if (!args[0]) {
          output = "open: missing file operand"
        } else {
          const file = files.find(f => f.title === args[0] || f.name === args[0])
          if (file) {
            output = `Opening ${file.title}...`
          } else {
            output = `open: ${args[0]}: No such file`
          }
        }
        break
      case "df":
        output = `Filesystem     Size   Used  Avail  Capacity
/dev/disk1    500GB  320GB  180GB    64%
/dev/disk2    1TB    650GB  350GB    65%`
        break
      case "top":
        output = `Processes: 345 total, 3 running, 342 sleeping
CPU usage: 12.5% user, 8.2% sys, 79.3% idle
Memory: 16.00GB used (8.5GB wired), 7.50GB unused`
        break
      case "ping":
        if (!args[0]) {
          output = "ping: missing host operand"
        } else {
          output = `PING ${args[0]} (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.052 ms
--- ${args[0]} ping statistics ---
2 packets transmitted, 2 packets received, 0.0% packet loss`
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
      // Tab completion for commands and files
      const commands = ["help", "clear", "date", "echo", "ls", "pwd", "whoami", "cd", "cat", "mkdir", "touch", "rm", "uname", "uptime", "history", "cal", "tree", "ps", "man", "find", "wc", "grep", "open", "df", "top", "ping"]
      const parts = currentCommand.split(" ")

      if (parts.length === 1) {
        // Complete command
        const match = commands.find(cmd => cmd.startsWith(currentCommand.toLowerCase()))
        if (match) {
          setCurrentCommand(match)
        }
      } else {
        // Complete file name
        const lastPart = parts[parts.length - 1].toLowerCase()
        const match = files.find(f =>
          f.title.toLowerCase().startsWith(lastPart) ||
          f.name.toLowerCase().startsWith(lastPart)
        )
        if (match) {
          parts[parts.length - 1] = match.title
          setCurrentCommand(parts.join(" "))
        }
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
