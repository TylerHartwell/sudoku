"use client"

import { ReactNode, useState } from "react"

const FetchPuzzleButton = ({
  handlePuzzleStartChange,
  handlePuzzleSolutionChange,
  children,
  className
}: {
  handlePuzzleStartChange: (puzzleStringStart: string) => void
  handlePuzzleSolutionChange: (puzzleSolution: string) => void
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

      const data: { puzzle: string; solution: string; _id: string } = await response.json()
      handlePuzzleStartChange(data.puzzle)
      handlePuzzleSolutionChange(data.solution)
    } catch (error) {
      console.log("PUZZLE FETCH ERROR: ", error)
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
