"use client"

import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import classNames from "classnames"

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
  const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)

  const toggleEliminated = () => {
    if (manualElimCandidates.includes(candidateKey) || !isEliminated) {
      toggleManualElimCandidate(gridSquareIndex, candidateIndex)
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.pointerType === "mouse" && isToggleable) {
      toggleEliminated()
    }
  }

  const candidateClassName = classNames({
    "highlight": candidateN === highlightN && (showCandidates || candidateMode) && !isEliminated,
    "toggleable": isToggleable,
    "candidate-mode": candidateMode,
    "mark-good": goodCandidates.includes(candidateKey) && !isEliminated,
    "mark-bad": badCandidates.includes(candidateKey) && !isEliminated
  })

  return (!showCandidates && !candidateMode) || entryShownValue ? null : (
    <div className={`candidate ${candidateClassName} no-hover:pointer-events-none`} onPointerDown={handlePointerDown}>
      {!isEliminated ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
