"use client"

import { MenuBar } from "./MenuBar"
import { Dock } from "./Dock"
import { WindowManager } from "./WindowManager"
import { motion } from "framer-motion"

export function Desktop() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
      style={{
        backgroundImage: `
          radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.05) 0px, transparent 50%),
          radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.05) 0px, transparent 50%),
          radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.05) 0px, transparent 50%),
          radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.05) 0px, transparent 50%),
          radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.05) 0px, transparent 50%),
          radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.05) 0px, transparent 50%),
          radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.05) 0px, transparent 50%)
        `,
      }}
    >
      <MenuBar />
      <WindowManager />
      <Dock />
    </motion.div>
  )
}
