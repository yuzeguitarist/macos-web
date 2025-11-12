"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function CalculatorApp() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleOperatorClick = (op: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operator && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator)
      setDisplay(String(result))
      setPreviousValue(result)
    }

    setWaitingForOperand(true)
    setOperator(op)
  }

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b
      case "-":
        return a - b
      case "×":
        return a * b
      case "÷":
        return a / b
      default:
        return b
    }
  }

  const handleEquals = () => {
    if (operator && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operator)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const handlePlusMinus = () => {
    const value = parseFloat(display)
    setDisplay(String(value * -1))
  }

  const handlePercent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  const buttons = [
    { label: "AC", onClick: handleClear, className: "bg-gray-300 hover:bg-gray-400 text-gray-900" },
    { label: "±", onClick: handlePlusMinus, className: "bg-gray-300 hover:bg-gray-400 text-gray-900" },
    { label: "%", onClick: handlePercent, className: "bg-gray-300 hover:bg-gray-400 text-gray-900" },
    { label: "÷", onClick: () => handleOperatorClick("÷"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "7", onClick: () => handleNumberClick("7"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "8", onClick: () => handleNumberClick("8"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "9", onClick: () => handleNumberClick("9"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "×", onClick: () => handleOperatorClick("×"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "4", onClick: () => handleNumberClick("4"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "5", onClick: () => handleNumberClick("5"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "6", onClick: () => handleNumberClick("6"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "−", onClick: () => handleOperatorClick("-"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "1", onClick: () => handleNumberClick("1"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "2", onClick: () => handleNumberClick("2"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "3", onClick: () => handleNumberClick("3"), className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "+", onClick: () => handleOperatorClick("+"), className: "bg-orange-500 hover:bg-orange-600 text-white" },

    { label: "0", onClick: () => handleNumberClick("0"), className: "bg-gray-600 hover:bg-gray-700 text-white col-span-2" },
    { label: ".", onClick: handleDecimal, className: "bg-gray-600 hover:bg-gray-700 text-white" },
    { label: "=", onClick: handleEquals, className: "bg-orange-500 hover:bg-orange-600 text-white" },
  ]

  return (
    <div className="h-full bg-gradient-to-b from-gray-800 to-gray-900 p-3 flex flex-col gap-3">
      {/* Display */}
      <div className="bg-black/30 rounded-xl p-6 text-right">
        <div className="text-5xl font-light text-white truncate">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={cn(
              "rounded-xl text-2xl font-light transition-all shadow-lg active:scale-95",
              button.className
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}
