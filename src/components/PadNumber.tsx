import CandidateContext from "@/contexts/CandidateContext"
import { symbols } from "@/hooks/useSudokuManagement"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
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
    puzzleStringCurrent,
    isAlreadyInUnit,
    manualElimCandidates
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
    isAlreadyInUnit: (gridSquareIndex: number, character: string, puzzleString: string) => boolean
    manualElimCandidates: string[]
  } = useContext(CandidateContext)

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
        if (symbols[index] == puzzleStringCurrent[lastFocusedEntryIndex]) {
          handleEntry(lastFocusedEntryIndex, "0")
        } else {
          handleEntry(lastFocusedEntryIndex, symbols[index])
          const isWrong = isAlreadyInUnit(lastFocusedEntryIndex, symbols[index], puzzleStringCurrent)

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
        const isAlreadyInUnit = getPeerGridSquareIndices(lastFocusedEntryIndex).some(i => puzzleStringCurrent[i] === symbols[index])

        const isEliminated = puzzleStringCurrent[lastFocusedEntryIndex] !== "0" || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)
        const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)
        if (isToggleable) {
          toggleManualElimCandidate(lastFocusedEntryIndex, index)
          handleQueueAutoSolve(true)
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
        `pad-number pad${index} w-full h-full text-center place-content-center text-[5vw] md:text-[30px] select-none hover-fine-device:hover:cursor-pointer hover-fine-device:hover:font-bold`,
        highlightIndex != null && index === highlightIndex && "font-bold",
        charCounts != undefined && charCounts[symbols[index]] === symbols.length && "opacity-30",
        lastFocusedEntryIndex !== null && !candidateMode && "shadow-green-700 drop-shadow-[1px_1px_0.5px_rgba(43,143,43,0.4)]",
        lastFocusedEntryIndex !== null && candidateMode && "shadow-red-700 drop-shadow-[1px_1px_0.5px_rgba(255,43,43,0.4)]"
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
