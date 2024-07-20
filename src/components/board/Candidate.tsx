"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"

interface CandidateProps {
  boxIndex: number
  candidateN: number
  rowIndex: number
  colIndex: number
  gridSquareIndex: number
  entryShownValue: string
}

const Candidate = ({ boxIndex, candidateN, rowIndex, colIndex, gridSquareIndex, entryShownValue }: CandidateProps) => {
  const [isEliminated, setIsEliminated] = useState(false)
  const toggledByUser = useRef(false)
  const { highlightN, showCandidates, candidateMode, puzzleStringCurrent, allBoxes, allColumns, allRows } =
    useContext(CandidateContext)

  const highlight = useMemo(() => {
    return candidateN === highlightN && showCandidates && !isEliminated ? "highlight" : ""
  }, [highlightN, showCandidates, isEliminated, candidateN])

  const noPointer = useMemo(() => (!candidateMode ? "no-pointer" : ""), [candidateMode])

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

  const toggleEliminated = () => {
    toggledByUser.current = !isEliminated
    setIsEliminated(prevState => !prevState)
  }

  if ((!showCandidates && !candidateMode) || entryShownValue) return null

  return (
    <div className={`candidate ${highlight} ${noPointer}`} onClick={toggleEliminated}>
      {!isEliminated ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
