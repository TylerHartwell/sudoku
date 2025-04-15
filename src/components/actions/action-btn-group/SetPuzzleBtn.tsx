import clsx from "clsx"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
  puzzleLength: number
  puzzleStringStart: string
}

const SetPuzzleBtn = ({
  children,
  onClick,
  puzzleLength,
  puzzleStringStart,
}: Props) => {
  return (
    <button
      className={clsx(
        "w-min rounded-[10px] text-[clamp(12px,4vw,16px)] active:bg-yellow-200",
        puzzleStringStart.length == puzzleLength && "animate-border-pulse",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default SetPuzzleBtn
