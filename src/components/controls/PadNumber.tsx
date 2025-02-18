import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import clsx from "clsx"
import { RefObject } from "react"

interface Props {
  index: number
  highlightIndex: number | null
  handleHighlightIndexChange: (n: number | null) => void
  lastClickedHighlightIndex: number | null
  changeLastClickedHighlightIndex: (n: number | null) => void
  symbol: string
  symbolsLength: number
  lastFocusedEntryIndex: number | null
  handleLastFocusedEntryIndex: (entryIndex: number | null) => void
  padNumberClicked: RefObject<boolean>
  handleEntry: (i: number, s: string) => void
  candidateMode: boolean
  charCounts: { [key: string]: number }
  handleQueueAutoSolve: (beQueued: boolean) => void
  puzzleStringCurrent: string
  isAlreadyInUnit: (gridSquareIndex: number, character: string, puzzleString: string) => boolean
  manualElimCandidates: string[]
  toggleCandidateQueueSolveOnElim: (gridSquareIndex: number, candidateIndex: number) => void
}

const PadNumber = ({
  index,
  highlightIndex,
  handleHighlightIndexChange,
  lastClickedHighlightIndex,
  changeLastClickedHighlightIndex,
  symbol,
  symbolsLength,
  lastFocusedEntryIndex,
  handleLastFocusedEntryIndex,
  padNumberClicked,
  handleEntry,
  candidateMode,
  charCounts,
  handleQueueAutoSolve,
  puzzleStringCurrent,
  isAlreadyInUnit,
  manualElimCandidates,
  toggleCandidateQueueSolveOnElim
}: Props) => {
  const handleMouseEnter = () => {
    handleHighlightIndexChange(index)
  }

  const handleMouseLeave = () => {
    handleHighlightIndexChange(lastClickedHighlightIndex)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    padNumberClicked.current = true

    if (lastFocusedEntryIndex != null) {
      if (!candidateMode) {
        if (symbol == puzzleStringCurrent[lastFocusedEntryIndex]) {
          handleEntry(lastFocusedEntryIndex, "0")
        } else {
          handleEntry(lastFocusedEntryIndex, symbol)
          const isWrong = isAlreadyInUnit(lastFocusedEntryIndex, symbol, puzzleStringCurrent)

          if (!isWrong) {
            handleLastFocusedEntryIndex(null)
            ;(document.activeElement as HTMLElement)?.blur()
            handleQueueAutoSolve(true)
          }
        }
        changeLastClickedHighlightIndex(index)
        handleHighlightIndexChange(index)
      } else {
        const candidateKey = `${lastFocusedEntryIndex}-${index}`
        const isAlreadyInUnit = getPeerGridSquareIndices(lastFocusedEntryIndex, symbolsLength).some(i => puzzleStringCurrent[i] === symbol)

        const isEliminated = puzzleStringCurrent[lastFocusedEntryIndex] !== "0" || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)
        const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)
        if (isToggleable) {
          toggleCandidateQueueSolveOnElim(lastFocusedEntryIndex, index)
        } else {
          ;(document.activeElement as HTMLElement)?.blur()
        }

        changeLastClickedHighlightIndex(index)
      }

      return
    }

    if (index === lastClickedHighlightIndex) {
      changeLastClickedHighlightIndex(null)
      handleHighlightIndexChange(null)
      return
    }

    changeLastClickedHighlightIndex(index)
    handleHighlightIndexChange(index)
  }

  return (
    <div
      className={clsx(
        `pad${index} w-full h-full text-center place-content-center text-[5vw] md:text-[30px] select-none hover:cursor-pointer hover:font-bold`,
        highlightIndex != null && index === highlightIndex && "font-bold",
        charCounts != undefined && charCounts[symbol] === symbolsLength && "opacity-30",
        lastFocusedEntryIndex !== null && !candidateMode && "shadow-green-700 drop-shadow-[1px_1px_0.5px_rgba(43,143,43,0.4)]",
        lastFocusedEntryIndex !== null && candidateMode && "shadow-red-700 drop-shadow-[1px_1px_0.5px_rgba(255,43,43,0.4)]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {symbol}
    </div>
  )
}

export default PadNumber
