"use client"

import clsx from "clsx"
import { ReactNode, useState } from "react"

const FetchPuzzleBtn = ({
  handlePuzzleStartChange,
  children,
  isHidden,
  difficulty
}: {
  handlePuzzleStartChange: (puzzleStringStart: string) => void
  children: ReactNode
  isHidden: boolean
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
    <button
      className={clsx("fetch-grid-string-btn col-start-2 rounded-[10px] shadow-[black_0px_0px_3px]", isHidden && "hidden")}
      onClick={handleClick}
    >
      {loading ? "Loading..." : children}
    </button>
  )
}

export default FetchPuzzleBtn
