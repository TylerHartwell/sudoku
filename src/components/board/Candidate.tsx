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
  const isToggleable =
    !isEliminated || manualElimCandidates.includes(candidateKey)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (isPointerDownInProgress) return
    if (isCandidateMode) {
      if (e.pointerType === "touch") {
        const candidateElement = e.currentTarget
        console.log("touch")

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
          "absolute z-20 flex size-full items-center justify-center text-[3vw] font-medium sm:text-[clamp(12px,min(2vh,2vw),30px)]",
          ((!shouldShowCandidates && !isCandidateMode) || entryShownValue) &&
            "invisible",
          candidateIndex === highlightIndex &&
            (shouldShowCandidates || isCandidateMode) &&
            !isEliminated &&
            "border-primary border-[1px] border-dashed bg-[rgb(248,248,120)] font-bold text-black",
          isToggleable && "border-secondary/50 border-[1px] border-dashed",
          isCandidateMode &&
            isToggleable &&
            "hover:bg-[#ff5353] hover:font-bold hover:text-black",
          !isCandidateMode && "pointer-events-none",
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
