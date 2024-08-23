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

const Candidate = ({ gridSquareIndex, boxIndex, rowIndex, colIndex, candidateN, entryShownValue }: CandidateProps) => {
  const [isEliminated, setIsEliminated] = useState(false)
  const { allUnits, highlightN, showCandidates, candidateMode, toggleManualElimCandidate, manualElimCandidates } = useContext(CandidateContext)

  const candidateKey = `${gridSquareIndex}-${candidateN}`
  const highlightClass = candidateN === highlightN && showCandidates && !isEliminated ? "highlight" : ""
  const noPointerClass = !candidateMode || (isEliminated && !manualElimCandidates.includes(candidateKey)) ? "no-pointer" : ""

  useEffect(() => {
    if (
      allUnits.allBoxes[boxIndex].includes(candidateN.toString()) ||
      allUnits.allRows[rowIndex].includes(candidateN.toString()) ||
      allUnits.allColumns[colIndex].includes(candidateN.toString()) ||
      entryShownValue ||
      manualElimCandidates.includes(candidateKey)
    ) {
      setIsEliminated(true)
    } else {
      setIsEliminated(false)
    }
  }, [entryShownValue, allUnits, boxIndex, candidateN, colIndex, rowIndex, gridSquareIndex, manualElimCandidates, candidateKey])

  const toggleEliminated = () => {
    if (manualElimCandidates.includes(candidateKey) || !isEliminated) {
      toggleManualElimCandidate(gridSquareIndex, candidateN)
    }
  }

  return (!showCandidates && !candidateMode) || entryShownValue ? null : (
    <div className={`candidate ${highlightClass} ${noPointerClass}`} onClick={toggleEliminated}>
      {!isEliminated ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
