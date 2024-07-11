"use client"

import { ReactNode } from "react"

const FetchPuzzleButton = ({
  setPuzzleStringStart,
  children,
  className
}: {
  setPuzzleStringStart: (puzzleStringStart: string) => void
  children: ReactNode
  className: string
}) => {
  const handleClick = async () => {
    try {
      const response = await fetch("/api/randomPuzzle")

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("Puzzle String: ", data)
      setPuzzleStringStart(data)
    } catch (error) {
      console.log("PAGE ERROR: ", error)
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  )
}

export default FetchPuzzleButton