import clsx from "clsx"
import { ChangeEventHandler } from "react"

interface Props {
  puzzleLength: number
  isHidden: boolean
  puzzleStringStart: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const PuzzleStringInput = ({
  puzzleLength,
  isHidden,
  puzzleStringStart,
  onChange,
}: Props) => {
  return (
    <input
      type="text"
      placeholder={`fetch or enter puzzle string of length ${puzzleLength}`}
      className={clsx(
        "my-0.5 h-[2em] w-[98%] select-text border px-1 text-[.85em]",
        "placeholder-copy/80",
        isHidden && "hidden",
      )}
      id="grid-string"
      value={puzzleStringStart}
      onChange={onChange}
    />
  )
}

export default PuzzleStringInput
