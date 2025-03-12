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
  const handleMouseEnter = () => {
    handleHighlightIndex(index)
  }

  const handleMouseLeave = () => {
    handleHighlightIndex(lastClickedHighlightIndex)
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
        const isToggleable =
          !isEliminated || manualElimCandidates.includes(candidateKey)
        if (isToggleable) {
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

  return (
    <div
      className={clsx(
        `pad${index} h-full w-full select-none place-content-center text-center text-[5vw] hover:cursor-pointer hover:font-bold md:text-[30px]`,
        highlightIndex != null && index === highlightIndex && "font-bold",
        charCounts != undefined &&
          charCounts[symbol] === symbolsLength &&
          "opacity-30",
        lastFocusedEntryIndex !== null &&
          !isCandidateMode &&
          "shadow-green-700 drop-shadow-[1px_1px_0.5px_rgba(43,143,43,0.4)]",
        lastFocusedEntryIndex !== null &&
          isCandidateMode &&
          "shadow-red-700 drop-shadow-[1px_1px_0.5px_rgba(255,43,43,0.4)]",
      )}
      data-pad-number
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {symbol}
    </div>
  )
}

export default PadNumber
