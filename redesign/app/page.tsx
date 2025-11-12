"use client"

import { Desktop } from "@/components/Desktop"
import { BootScreen } from "@/components/BootScreen"
import { useState, useEffect } from "react"

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="h-screen w-screen overflow-hidden">
      {isBooting ? <BootScreen /> : <Desktop />}
    </main>
  )
}
