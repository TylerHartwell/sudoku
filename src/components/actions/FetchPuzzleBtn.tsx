"use client"

import { ReactNode, useState } from "react"

const FetchPuzzleBtn = ({
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

      const response = await fetch(`/api/randomPuzzle?difficulty=${difficulty}`)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data: { puzzle: string; difficulty: number } = await response.json()

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

export default FetchPuzzleBtn
