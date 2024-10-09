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
        `pad-number pad${number} w-full h-full text-center place-content-center text-[5vw] md:text-[30px] select-none hover-fine-device:hover:cursor-pointer hover-fine-device:hover:font-bold`,
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
