import clsx from "clsx"
import { useMemo } from "react"

interface PadNumberProps {
  number: number
  highlightN: number
  handleHighlightNChange: (n: number) => void
  lastClickedHighlightN: number
  changeLastClickedHighlightN: (n: number) => void
}

const PadNumber = ({ number, highlightN, handleHighlightNChange, lastClickedHighlightN, changeLastClickedHighlightN }: PadNumberProps) => {
  const highlight = useMemo(() => {
    return number === highlightN ? "highlight" : ""
  }, [highlightN, number])

  const handleMouseEnter = () => {
    handleHighlightNChange(number)
  }

  const handleMouseLeave = () => {
    handleHighlightNChange(lastClickedHighlightN)
  }

  const handleClick = () => {
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
        `pad-number pad${number} w-[calc(100%/9)] py-[5px] px-0 h-[1fr] text-center text-[2em] select-none hover-fine-device:hover:cursor-pointer hover-fine-device:hover:font-bold`,
        number === highlightN && "font-bold"
      )}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      {number}
    </div>
  )
}

export default PadNumber
