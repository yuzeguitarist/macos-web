"use client"

import { useEffect } from "react"
import { MenuBar } from "./MenuBar"
import { Dock } from "./Dock"
import { WindowManager } from "./WindowManager"
import { motion } from "framer-motion"
import { useWindowStore } from "@/store/useWindowStore"

export function Desktop() {
  const { closeWindow, activeWindow } = useWindowStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      // Command/Ctrl + Q: Close active window (only prevent if there's an active window)
      if (cmdKey && e.key === 'q' && activeWindow) {
        e.preventDefault()
        closeWindow(activeWindow)
      }

      // Note: Other shortcuts like Ctrl+Backspace, Ctrl+Tab, Ctrl+C are intentionally
      // not prevented to preserve native browser behavior until specific app functionality
      // is implemented that requires overriding them.
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeWindow, closeWindow])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg,
            hsl(210, 20%, 98%) 0%,
            hsl(205, 18%, 96%) 25%,
            hsl(200, 15%, 97%) 50%,
            hsl(195, 18%, 98%) 75%,
            hsl(210, 20%, 99%) 100%
          )`,
        backgroundImage: `
          radial-gradient(at 20% 30%, hsla(210, 40%, 92%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 20%, hsla(200, 35%, 94%, 0.25) 0px, transparent 50%),
          radial-gradient(at 60% 80%, hsla(205, 38%, 93%, 0.28) 0px, transparent 50%),
          radial-gradient(at 30% 70%, hsla(195, 42%, 95%, 0.2) 0px, transparent 50%),
          radial-gradient(at 90% 90%, hsla(215, 35%, 96%, 0.22) 0px, transparent 50%),
          linear-gradient(135deg,
            hsl(210, 20%, 98%) 0%,
            hsl(205, 18%, 96%) 25%,
            hsl(200, 15%, 97%) 50%,
            hsl(195, 18%, 98%) 75%,
            hsl(210, 20%, 99%) 100%
          )
        `,
      }}
    >
      <MenuBar />
      <WindowManager />
      <Dock />
    </motion.div>
  )
}
