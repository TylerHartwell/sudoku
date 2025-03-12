"use client"

import { Difficulty } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
import { ReactNode, useState } from "react"

interface Props {
  handlePuzzleStringStart: (puzzleStringStart: string) => void
  children: ReactNode
  isHidden: boolean
  difficulty: Difficulty
}

const FetchPuzzleBtn = ({
  handlePuzzleStringStart,
  children,
  isHidden,
  difficulty,
}: Props) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)

      const response = await fetch(`/api/randomPuzzle?difficulty=${difficulty}`)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data: { puzzle: string; difficulty: number } = await response.json()

      handlePuzzleStringStart(data.puzzle)
    } catch (error) {
      console.log("PUZZLE FETCH ERROR: ", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={clsx(
        "text-copy border-accent col-start-2 rounded-[10px] border-2",
        isHidden && "hidden",
      )}
      onClick={handleClick}
    >
      {loading ? "Loading..." : children}
    </button>
  )
}

export default FetchPuzzleBtn
