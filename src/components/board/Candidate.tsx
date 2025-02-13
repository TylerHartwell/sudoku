"use client"

import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import clsx from "clsx"
import { symbols } from "@/hooks/useSudokuManagement"

interface CandidateProps {
  gridSquareIndex: number
  candidateIndex: number
  entryShownValue: string
}

const Candidate = ({ gridSquareIndex, candidateIndex, entryShownValue }: CandidateProps) => {
  const {
    puzzleStringCurrent,
    highlightIndex,
    showCandidates,
    candidateMode,
    manualElimCandidates,
    goodCandidates,
    badCandidates,
    toggleCandidateQueueSolveOnElim
  }: {
    puzzleStringCurrent: string
    highlightIndex: number | null
    showCandidates: boolean
    candidateMode: boolean
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => void
    manualElimCandidates: string[]
    goodCandidates: string[]
    badCandidates: string[]
    handleQueueAutoSolve: (beQueued: boolean) => void
    toggleCandidateQueueSolveOnElim: (gridSquareIndex: number, candidateIndex: number) => void
  } = useContext(CandidateContext)

  const candidateKey = `${gridSquareIndex}-${candidateIndex}`
  const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === symbols[candidateIndex])

  const isEliminated = entryShownValue || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)
  const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (candidateMode) {
      if (e.pointerType === "touch") {
        const candidateElement = e.currentTarget

        candidateElement.classList.add("pointer-events-none")

        const elementUnderneath = document.elementFromPoint(e.clientX, e.clientY)

        candidateElement.classList.remove("pointer-events-none")

        if (elementUnderneath) {
          const event = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            isPrimary: true,
            clientX: e.clientX,
            clientY: e.clientY
          })

          elementUnderneath.dispatchEvent(event)
        }
      } else {
        if (isToggleable) {
          e.stopPropagation()

          toggleCandidateQueueSolveOnElim(gridSquareIndex, candidateIndex)
        }
      }
    }
  }

  return (
    <div className="relative size-full">
      <div
        className={clsx(
          "candidate absolute text-[3vw] md:text-[clamp(12px,min(2vh,2vw),30px)] flex justify-center items-center size-full z-20",
          ((!showCandidates && !candidateMode) || entryShownValue) && "invisible",
          candidateIndex === highlightIndex && (showCandidates || candidateMode) && !isEliminated && "bg-[rgb(248,248,120)] font-bold",
          isToggleable && "border-[1px] border-dashed border-[#0000ff31]",
          candidateMode && isToggleable && "hover:font-bold hover:bg-[#ff5353]",
          !candidateMode && "pointer-events-none",
          goodCandidates.includes(candidateKey) && !isEliminated && "bg-[rgb(45,241,77)] font-bold",
          badCandidates.includes(candidateKey) && !isEliminated && "bg-[red] font-bold"
        )}
        data-grid-square-index={gridSquareIndex}
        data-candidate-index={candidateIndex}
        onPointerDown={handlePointerDown}
      >
        {!isEliminated ? symbols[candidateIndex] : ""}
      </div>
    </div>
  )
}

export default Candidate
