"use client"

import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getRowColBox from "@/utils/getRowColBox"

interface CandidateProps {
  gridSquareIndex: number
  candidateIndex: number
  entryShownValue: string
}

const Candidate = ({ gridSquareIndex, candidateIndex, entryShownValue }: CandidateProps) => {
  const { allUnits, highlightN, showCandidates, candidateMode, toggleManualElimCandidate, manualElimCandidates, goodCandidates, badCandidates } =
    useContext(CandidateContext)

  const candidateKey = `${gridSquareIndex}-${candidateIndex}`
  const { rowIndex, colIndex, boxIndex } = getRowColBox(gridSquareIndex)
  const candidateN = candidateIndex + 1

  const isEliminated =
    entryShownValue ||
    manualElimCandidates.includes(candidateKey) ||
    allUnits.allBoxes[boxIndex].includes(candidateN.toString()) ||
    allUnits.allRows[rowIndex].includes(candidateN.toString()) ||
    allUnits.allColumns[colIndex].includes(candidateN.toString())

  const highlightClass = candidateN === highlightN && showCandidates && !isEliminated ? "highlight" : ""
  const noPointerClass = !candidateMode || (isEliminated && !manualElimCandidates.includes(candidateKey)) ? "no-pointer" : ""
  const markGoodClass = goodCandidates.includes(candidateKey) && !isEliminated ? "mark-good" : ""
  const markBadClass = badCandidates.includes(candidateKey) && !isEliminated ? "mark-bad" : ""

  const toggleEliminated = () => {
    if (manualElimCandidates.includes(candidateKey) || !isEliminated) {
      toggleManualElimCandidate(gridSquareIndex, candidateIndex)
    }
  }

  return (!showCandidates && !candidateMode) || entryShownValue ? null : (
    <div className={`candidate ${highlightClass} ${noPointerClass} ${markGoodClass} ${markBadClass}`} onClick={toggleEliminated}>
      {!isEliminated ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
