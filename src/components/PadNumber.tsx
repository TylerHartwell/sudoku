import CandidateContext from "@/contexts/CandidateContext"
import { symbols } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
import { useContext, useMemo } from "react"

interface PadNumberProps {
  number: number
  highlightN: number
  handleHighlightNChange: (n: number) => void
  lastClickedHighlightN: number
  changeLastClickedHighlightN: (n: number) => void
}

const PadNumber = ({ number, highlightN, handleHighlightNChange, lastClickedHighlightN, changeLastClickedHighlightN }: PadNumberProps) => {
  const {
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked,
    handleEntry,
    candidateMode,
    toggleManualElimCandidate,
    charCounts
  }: {
    lastFocusedEntryIndex: number | null
    handleLastFocusedEntryIndex: (entryIndex: number | null) => void
    padNumberClicked: React.MutableRefObject<boolean>
    handleEntry: (i: number, s: string) => void
    candidateMode: boolean
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => void
    charCounts: { [key: string]: number }
  } = useContext(CandidateContext)

  const handleMouseEnter = () => {
    handleHighlightNChange(number)
  }

  const handleMouseLeave = () => {
    handleHighlightNChange(lastClickedHighlightN)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    padNumberClicked.current = true

    if (lastFocusedEntryIndex != null) {
      if (!candidateMode) {
        handleEntry(lastFocusedEntryIndex, number.toString())
        changeLastClickedHighlightN(number)
        handleHighlightNChange(number)
      } else {
        toggleManualElimCandidate(lastFocusedEntryIndex, number - 1)
        changeLastClickedHighlightN(number)
      }
      handleLastFocusedEntryIndex(null)
      return
    }

    if (number === lastClickedHighlightN) {
      changeLastClickedHighlightN(0)
      handleHighlightNChange(0)
      return
    }

    changeLastClickedHighlightN(number)
    handleHighlightNChange(number)
  }

  return (
    <div
      className={clsx(
        `pad-number pad${number} w-full h-full text-center place-content-center text-[5vw] md:text-[30px] select-none hover-fine-device:hover:cursor-pointer hover-fine-device:hover:font-bold`,
        number === highlightN && "font-bold",
        charCounts != undefined && charCounts[symbols[number - 1]] === symbols.length && "opacity-30"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {symbols[number - 1]}
    </div>
  )
}

export default PadNumber
