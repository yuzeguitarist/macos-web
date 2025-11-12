"use client"

import { motion } from "framer-motion"

export function BootScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50.8 21.6c-1.6-2.4-4.4-4-7.6-3.6-2.8.4-5.2 2-6.8 4.4-1.2 1.6-2 3.6-2 5.6 0 4.4 3.6 8 8 8 2.4 0 4.4-1.2 6-2.8 1.2-1.6 2-3.6 2-5.6 0-2-.4-4-1.6-6zm8.4 10c-2.4-1.2-5.2-1.6-7.6-.8-2.8.8-5.2 2.8-6.4 5.6-.8 2-1.2 4.4-.8 6.8.8 4.4 4.8 7.6 9.2 7.2 2.4-.4 4.4-1.6 6-3.6 1.2-1.6 2-3.6 2-5.6 0-3.6-1.2-6.8-2.4-9.6zm-24.4-2.4c-2.8-.4-5.6.4-7.6 2.4-2.4 2-4 5.2-4 8.4 0 2.4.8 4.8 2.4 6.8 3.2 3.6 8.8 4 12.4.8 2-1.6 3.2-4 3.6-6.8.4-2.4-.4-4.8-1.6-6.8-1.6-2.4-3.6-4.4-5.2-4.8zm-8.4 18.4c-2.8.8-5.2 2.8-6.8 5.6-1.6 2.4-2 5.6-1.6 8.4.8 4.4 4.8 7.6 9.2 7.2 2.4-.4 4.4-1.6 6-3.6 1.2-1.6 2-3.6 2-5.6 0-3.6-1.6-6.8-3.6-9.2-1.6-1.6-3.6-2.4-5.2-2.8z"
            fill="white"
          />
        </svg>
      </motion.div>

      <motion.div
        className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-white rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
