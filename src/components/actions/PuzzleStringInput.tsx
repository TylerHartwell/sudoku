import clsx from "clsx"
import { ChangeEventHandler } from "react"

interface Props {
  puzzleLength: number
  isHidden: boolean
  puzzleStringStart: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const PuzzleStringInput = ({ puzzleLength, isHidden, puzzleStringStart, onChange }: Props) => {
  return (
    <input
      type="text"
      placeholder={`fetch or enter puzzle string of length ${puzzleLength}`}
      className={clsx("w-[98%] border-none bg-white px-1 h-[2em] text-[.85em] my-[2px] select-text", isHidden && "hidden")}
      id="grid-string"
      value={puzzleStringStart}
      onChange={onChange}
    />
  )
}

export default PuzzleStringInput
