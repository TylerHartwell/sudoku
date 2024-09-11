"use client"

import { ReactNode, useState } from "react"

const FetchPuzzleButton = ({
  handlePuzzleStartChange,
  children,
  className,
  difficulty
}: {
  handlePuzzleStartChange: (puzzleStringStart: string) => void
  children: ReactNode
  className: string
  difficulty: "easy" | "medium" | "hard" | "diabolical"
}) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      console.log(difficulty)
      const response = await fetch(`/api/randomPuzzle?difficulty=${difficulty}`)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data: { puzzle: string; difficulty: number } = await response.json()
      console.log(data.difficulty)
      handlePuzzleStartChange(data.puzzle)
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
