"use client"

import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import clsx from "clsx"

interface Props {
  symbol: string
  gridSquareIndex: number
  candidateIndex: number
  entryShownValue: string
  puzzleStringCurrent: string
  highlightIndex: number | null
  shouldShowCandidates: boolean
  isCandidateMode: boolean
  manualElimCandidates: string[]
  goodCandidates: string[]
  badCandidates: string[]
  toggleCandidateQueueSolveOnElim: (
    gridSquareIndex: number,
    candidateIndex: number,
  ) => void
  symbolsLength: number
  boxSize: number
}

let isPointerDownInProgress = false

const Candidate = ({
  symbol,
  gridSquareIndex,
  candidateIndex,
  entryShownValue,
  puzzleStringCurrent,
  highlightIndex,
  shouldShowCandidates,
  isCandidateMode,
  manualElimCandidates,
  goodCandidates,
  badCandidates,
  toggleCandidateQueueSolveOnElim,
  symbolsLength,
  boxSize,
}: Props) => {
  const candidateKey = `${gridSquareIndex}-${candidateIndex}`
  const isAlreadyInUnit = getPeerGridSquareIndices(
    gridSquareIndex,
    symbolsLength,
  ).some((i) => puzzleStringCurrent[i] === symbol)

  const isEliminated =
    entryShownValue ||
    isAlreadyInUnit ||
    manualElimCandidates.includes(candidateKey)
  const isAllowed = !isEliminated || manualElimCandidates.includes(candidateKey)
  const shouldShow =
    !entryShownValue && (shouldShowCandidates || isCandidateMode)
  const shouldHighlight = candidateIndex === highlightIndex && !isEliminated

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isPointerDownInProgress) return
    if (isCandidateMode) {
      if (e.pointerType === "touch") {
        const candidateElement = e.currentTarget

        if (candidateElement.classList.contains("pointer-events-none")) return
        candidateElement.classList.add("pointer-events-none")

        const elementUnderneath = document.elementFromPoint(
          e.clientX,
          e.clientY,
        )

        candidateElement.classList.remove("pointer-events-none")

        if (elementUnderneath) {
          isPointerDownInProgress = true
          const event = new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            isPrimary: true,
            clientX: e.clientX,
            clientY: e.clientY,
          })

          elementUnderneath.dispatchEvent(event)
          setTimeout(() => {
            isPointerDownInProgress = false
          }, 0)
        }
      } else {
        if (isAllowed) {
          e.stopPropagation()

          toggleCandidateQueueSolveOnElim(gridSquareIndex, candidateIndex)
        }
      }
    }
  }

  if (!shouldShow) {
    return null
  }

  return (
    <div className="relative size-full">
      <div
        className={clsx(
          "absolute z-20 flex size-full items-center justify-center font-medium",
          boxSize == 2 && "text-[calc(1em/2)]",
          boxSize == 3 && "text-[calc(1em/3)]",
          boxSize == 4 && "text-[calc(1em/4)]",
          shouldHighlight && "bg-[rgb(248,248,120)] font-bold text-black",
          isAllowed && "border-secondary/50 border border-dashed",
          isCandidateMode && isAllowed
            ? "has-hover:pointer-events-auto has-hover:hover:font-bold has-hover:hover:text-black has-hover:hover:bg-[#ff5353]"
            : "pointer-events-none",
          goodCandidates.includes(candidateKey) &&
            !isEliminated &&
            "bg-[rgb(45,241,77)] font-bold text-black",
          badCandidates.includes(candidateKey) &&
            !isEliminated &&
            "bg-[red] font-bold text-black",
        )}
        data-grid-square-index={gridSquareIndex}
        data-candidate-index={candidateIndex}
        onPointerDown={handlePointerDown}
      >
        {!isEliminated ? symbol : ""}
      </div>
    </div>
  )
}

export default Candidate
