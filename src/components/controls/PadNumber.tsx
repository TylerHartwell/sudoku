import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import clsx from "clsx"
import { RefObject } from "react"

interface Props {
  index: number
  highlightIndex: number | null
  handleHighlightIndex: (n: number | null) => void
  lastClickedHighlightIndex: number | null
  handleLastClickedHighlightIndex: (n: number | null) => void
  symbol: string
  symbolsLength: number
  lastFocusedEntryIndex: number | null
  handleLastFocusedEntryIndex: (entryIndex: number | null) => void
  padNumberClicked: RefObject<boolean>
  handleEntry: (i: number, s: string) => void
  isCandidateMode: boolean
  charCounts: { [key: string]: number }
  handleShouldAutoSolve: (beQueued: boolean) => void
  puzzleStringCurrent: string
  isAlreadyInUnit: (
    gridSquareIndex: number,
    character: string,
    puzzleString: string,
  ) => boolean
  manualElimCandidates: string[]
  toggleCandidateQueueSolveOnElim: (
    gridSquareIndex: number,
    candidateIndex: number,
  ) => void
}

const PadNumber = ({
  index,
  highlightIndex,
  handleHighlightIndex,
  lastClickedHighlightIndex,
  handleLastClickedHighlightIndex,
  symbol,
  symbolsLength,
  lastFocusedEntryIndex,
  handleLastFocusedEntryIndex,
  padNumberClicked,
  handleEntry,
  isCandidateMode,
  charCounts,
  handleShouldAutoSolve,
  puzzleStringCurrent,
  isAlreadyInUnit,
  manualElimCandidates,
  toggleCandidateQueueSolveOnElim,
}: Props) => {
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") {
      handleHighlightIndex(index)
    }
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") {
      handleHighlightIndex(lastClickedHighlightIndex)
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    padNumberClicked.current = true

    if (lastFocusedEntryIndex != null) {
      if (!isCandidateMode) {
        if (symbol == puzzleStringCurrent[lastFocusedEntryIndex]) {
          handleEntry(lastFocusedEntryIndex, "0")
        } else {
          handleEntry(lastFocusedEntryIndex, symbol)
          const isWrong = isAlreadyInUnit(
            lastFocusedEntryIndex,
            symbol,
            puzzleStringCurrent,
          )

          if (!isWrong) {
            handleLastFocusedEntryIndex(null)
            ;(document.activeElement as HTMLElement)?.blur()
            handleShouldAutoSolve(true)
          }
        }
        handleLastClickedHighlightIndex(index)
        handleHighlightIndex(index)
      } else {
        const candidateKey = `${lastFocusedEntryIndex}-${index}`
        const isAlreadyInUnit = getPeerGridSquareIndices(
          lastFocusedEntryIndex,
          symbolsLength,
        ).some((i) => puzzleStringCurrent[i] === symbol)

        const isEliminated =
          puzzleStringCurrent[lastFocusedEntryIndex] !== "0" ||
          isAlreadyInUnit ||
          manualElimCandidates.includes(candidateKey)
        const isAllowed =
          !isEliminated || manualElimCandidates.includes(candidateKey)
        if (isAllowed) {
          toggleCandidateQueueSolveOnElim(lastFocusedEntryIndex, index)
        } else {
          ;(document.activeElement as HTMLElement)?.blur()
        }

        handleLastClickedHighlightIndex(index)
      }

      return
    }

    if (index === lastClickedHighlightIndex) {
      handleLastClickedHighlightIndex(null)
      handleHighlightIndex(null)
      padNumberClicked.current = false
      return
    }

    handleLastClickedHighlightIndex(index)
    handleHighlightIndex(index)
  }

  const isHighlightedIndex = highlightIndex != null && index === highlightIndex
  const hasUsedFullCount =
    charCounts != undefined && charCounts[symbol] === symbolsLength
  const shouldShowAsEntryAble =
    lastFocusedEntryIndex !== null && !isCandidateMode
  const shouldShowAsCandidateAble =
    lastFocusedEntryIndex !== null && isCandidateMode

  return (
    <div
      className={clsx(
        `pad${index} h-full flex-1 select-none place-content-center text-center text-[5vw] sm:text-[30px]`,
        "has-hover:hover:cursor-pointer",
        isHighlightedIndex && "font-bold",
        hasUsedFullCount && "opacity-30",
        shouldShowAsEntryAble && "underline decoration-green-700",
        shouldShowAsCandidateAble && "underline decoration-red-700",
      )}
      data-pad-number
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
    >
      {symbol}
    </div>
  )
}

export default PadNumber
