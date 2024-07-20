"use client"

import { ReactNode, useState } from "react"

const FetchPuzzleButton = ({
  setPuzzleStringStart,
  setPuzzleSolution,
  children,
  className
}: {
  setPuzzleStringStart: (puzzleStringStart: string) => void
  setPuzzleSolution: (puzzleSolution: string) => void
  children: ReactNode
  className: string
}) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/randomPuzzle")

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("Puzzle String: ", data)
      setPuzzleStringStart(data.puzzle)
      setPuzzleSolution(data.solution)
    } catch (error) {
      console.log("PAGE ERROR: ", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      {loading ? "Loading..." : children}
    </button>
  )
}

export default FetchPuzzleButton
