import { useMemo } from "react"

interface PadNumberProps {
  number: number
  highlightN: number
  setHighlightN: (n: number) => void
  lastClickedHighlightN: number
  setLastClickedHighlightN: (n: number) => void
}

const PadNumber = ({ number, highlightN, setHighlightN, lastClickedHighlightN, setLastClickedHighlightN }: PadNumberProps) => {
  const highlight = useMemo(() => {
    return number === highlightN ? "highlight" : ""
  }, [highlightN, number])

  const handleMouseEnter = () => {
    setHighlightN(number)
  }

  const handleMouseLeave = () => {
    setHighlightN(lastClickedHighlightN)
  }

  const handleClick = () => {
    if (number === lastClickedHighlightN) {
      setLastClickedHighlightN(0)
      setHighlightN(0)
      return
    }
    setLastClickedHighlightN(number)
    setHighlightN(number)
  }

  return (
    <div
      className={`pad-number pad${number} ${highlight}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      {number}
    </div>
  )
}

export default PadNumber
