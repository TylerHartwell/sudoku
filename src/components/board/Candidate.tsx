"use client"

import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import clsx from "clsx"

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

  return (
    <div className="relative size-full">
      <div
        className={clsx(
          "candidate absolute text-[3vw] md:text-[clamp(12px,min(2vh,2vw),30px)] flex justify-center items-center size-full pointer-events-none",
          ((!showCandidates && !candidateMode) || entryShownValue) && "invisible",
          candidateN === highlightN && (showCandidates || candidateMode) && !isEliminated && "bg-[rgb(248,248,120)] font-bold",
          isToggleable && "border-[1px] border-dashed border-[#0000ff31] hover-fine-device:hover:font-bold hover-fine-device:hover:bg-[#ff5353]",
          candidateMode && "hover-fine-device:pointer-events-auto",
          goodCandidates.includes(candidateKey) && !isEliminated && "bg-[rgb(45,241,77)] font-bold",
          badCandidates.includes(candidateKey) && !isEliminated && "bg-[red] font-bold"
        )}
        onPointerDown={handlePointerDown}
      >
        {!isEliminated ? candidateN.toString() : ""}
      </div>
    </div>
  )
}

export default Candidate
