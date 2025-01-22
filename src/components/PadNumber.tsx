import CandidateContext from "@/contexts/CandidateContext"
import { symbols } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
import { useContext, useMemo } from "react"

interface PadNumberProps {
  index: number
  highlightIndex: number | null
  handleHighlightIndexChange: (n: number | null) => void
  lastClickedHighlightIndex: number | null
  changeLastClickedHighlightIndex: (n: number | null) => void
}

const PadNumber = ({
  index,
  highlightIndex,
  handleHighlightIndexChange,
  lastClickedHighlightIndex,
  changeLastClickedHighlightIndex
}: PadNumberProps) => {
  const {
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked,
    handleEntry,
    candidateMode,
    toggleManualElimCandidate,
    charCounts,
    handleQueueAutoSolve,
    puzzleStringCurrent
  }: {
    lastFocusedEntryIndex: number | null
    handleLastFocusedEntryIndex: (entryIndex: number | null) => void
    padNumberClicked: React.MutableRefObject<boolean>
    handleEntry: (i: number, s: string) => void
    candidateMode: boolean
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => void
    charCounts: { [key: string]: number }
    handleQueueAutoSolve: (beQueued: boolean) => void
    puzzleStringCurrent: string
  } = useContext(CandidateContext)

  const handleMouseEnter = () => {
    handleHighlightIndexChange(index)
  }

  const handleMouseLeave = () => {
    handleHighlightIndexChange(lastClickedHighlightIndex)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    padNumberClicked.current = true

    if (lastFocusedEntryIndex != null) {
      if (!candidateMode) {
        if (symbols[index] == puzzleStringCurrent[lastFocusedEntryIndex]) {
          handleEntry(lastFocusedEntryIndex, "0")
        } else {
          handleEntry(lastFocusedEntryIndex, symbols[index])
        }
        handleEntry(lastFocusedEntryIndex, symbols[index])
        changeLastClickedHighlightIndex(index)
        handleHighlightIndexChange(index)
      } else {
        toggleManualElimCandidate(lastFocusedEntryIndex, index)
        changeLastClickedHighlightIndex(index)
        handleQueueAutoSolve(true)
      }
      handleLastFocusedEntryIndex(null)
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
        `pad-number pad${index} w-full h-full text-center place-content-center text-[5vw] md:text-[30px] select-none hover-fine-device:hover:cursor-pointer hover-fine-device:hover:font-bold`,
        highlightIndex != null && index === highlightIndex && "font-bold",
        charCounts != undefined && charCounts[symbols[index]] === symbols.length && "opacity-30"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {symbols[index]}
    </div>
  )
}

export default PadNumber
