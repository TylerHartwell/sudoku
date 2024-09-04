"use client"

import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"

interface CandidateProps {
  gridSquareIndex: number
  candidateIndex: number
  entryShownValue: string
}

const Candidate = ({ gridSquareIndex, candidateIndex, entryShownValue }: CandidateProps) => {
  const {
    puzzleStringCurrent,
    highlightN,
    showCandidates,
    candidateMode,
    toggleManualElimCandidate,
    manualElimCandidates,
    goodCandidates,
    badCandidates
  } = useContext(CandidateContext)

  const candidateKey = `${gridSquareIndex}-${candidateIndex}`
  const candidateN = candidateIndex + 1
  const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === candidateN.toString())

  const isEliminated = entryShownValue || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)

  const highlightClass = candidateN === highlightN && (showCandidates || candidateMode) && !isEliminated ? "highlight" : ""
  const noPointerClass = isEliminated && !manualElimCandidates.includes(candidateKey) ? "no-pointer" : ""
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
