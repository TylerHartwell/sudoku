"use client"

import { useEffect, useRef, useState } from "react"
import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"

interface CandidateProps {
  boxIndex: number
  candidateN: number
  rowIndex: number
  colIndex: number
  gridSquareIndex: number
}

const Candidate = ({ boxIndex, candidateN, rowIndex, colIndex, gridSquareIndex }: CandidateProps) => {
  const [isEliminated, setIsEliminated] = useState(false)
  const toggledByUser = useRef(false)
  const { highlightCandidates, showCandidates, candidateMode, puzzleStringCurrent, allBoxes, allColumns, allRows } =
    useContext(CandidateContext)

  const toggleEliminated = () => {
    toggledByUser.current = !isEliminated
    setIsEliminated(prevState => !prevState)
  }

  useEffect(() => {
    if (
      allBoxes[boxIndex].includes(candidateN) ||
      allRows[rowIndex].includes(candidateN) ||
      allColumns[colIndex].includes(candidateN) ||
      puzzleStringCurrent[gridSquareIndex] != "0"
    ) {
      setIsEliminated(true)
    } else {
      if (!toggledByUser.current) {
        setIsEliminated(false)
      }
    }
  }, [puzzleStringCurrent, allBoxes, allColumns, allRows, boxIndex, candidateN, colIndex, rowIndex, gridSquareIndex])

  const highlight: string = candidateN == highlightCandidates && showCandidates && !isEliminated ? "highlight" : ""
  const noPointer: string = !candidateMode ? "no-pointer" : ""

  return (
    <div className={`candidate ${highlight} ${noPointer}`} onClick={toggleEliminated}>
      {!isEliminated && (showCandidates || candidateMode) ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
