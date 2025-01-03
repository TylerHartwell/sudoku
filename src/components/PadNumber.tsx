import CandidateContext from "@/contexts/CandidateContext"
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
    handleEntry
  }: {
    lastFocusedEntryIndex: number | null
    handleLastFocusedEntryIndex: (entryIndex: number | null) => void
    padNumberClicked: React.MutableRefObject<boolean>
    handleEntry: (i: number, s: string) => void
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
      handleEntry(lastFocusedEntryIndex, number.toString())
      handleLastFocusedEntryIndex(null)
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
        number === highlightN && "font-bold"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {number}
    </div>
  )
}

export default PadNumber
