"use client"

import { useWindowStore } from "@/store/useWindowStore"
import { Window } from "./Window"

export function WindowManager() {
  const { windows } = useWindowStore()

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
    </>
  )
}
