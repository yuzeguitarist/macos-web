export interface TerminalCommand {
  name: string
  description: string
  usage: string
}

export const terminalCommands: TerminalCommand[] = [
  { name: "help", description: "Show this help message", usage: "help" },
  { name: "clear", description: "Clear the terminal", usage: "clear" },
  { name: "date", description: "Show current date and time", usage: "date" },
  { name: "echo", description: "Echo a message", usage: "echo <msg>" },
  { name: "ls", description: "List files in directory", usage: "ls [dir]" },
  { name: "pwd", description: "Print working directory", usage: "pwd" },
  { name: "whoami", description: "Display current user", usage: "whoami" },
  { name: "cd", description: "Change directory", usage: "cd <dir>" },
  { name: "cat", description: "Display file contents", usage: "cat <file>" },
  { name: "mkdir", description: "Create directory", usage: "mkdir <dir>" },
  { name: "touch", description: "Create empty file", usage: "touch <file>" },
  { name: "rm", description: "Remove file (move to trash)", usage: "rm <file>" },
  { name: "uname", description: "System information", usage: "uname [-a]" },
  { name: "uptime", description: "System uptime", usage: "uptime" },
  { name: "history", description: "Show command history", usage: "history" },
  { name: "cal", description: "Show calendar", usage: "cal" },
  { name: "tree", description: "Display directory tree", usage: "tree" },
  { name: "ps", description: "Show running processes", usage: "ps" },
  { name: "man", description: "Show manual for command", usage: "man <cmd>" },
  { name: "find", description: "Find files by name", usage: "find <name>" },
  { name: "wc", description: "Word count", usage: "wc <file>" },
  { name: "grep", description: "Search in files", usage: "grep <text>" },
  { name: "open", description: "Open file", usage: "open <file>" },
  { name: "df", description: "Disk space usage", usage: "df" },
  { name: "top", description: "Process monitor", usage: "top" },
  { name: "ping", description: "Test network connection", usage: "ping <host>" },
]

export function getCommandNames(): string[] {
  return terminalCommands.map(cmd => cmd.name)
}

export function getHelpText(): string {
  const maxNameLength = Math.max(...terminalCommands.map(cmd => cmd.usage.length))
  return "Available commands:\n" +
    terminalCommands.map(cmd =>
      `  ${cmd.usage.padEnd(maxNameLength + 2)}- ${cmd.description}`
    ).join("\n")
}
