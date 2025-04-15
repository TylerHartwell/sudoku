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
  const disabled = puzzleStringStart.length == 0
  return (
    <button
      className={clsx(
        "w-min rounded-[10px] text-[clamp(12px,4vw,16px)] disabled:opacity-50",
        puzzleStringStart.length == puzzleLength && "animate-border-pulse",
        !disabled && "active:bg-yellow-200",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default SetPuzzleBtn
