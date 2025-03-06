import clsx from "clsx";
import { ChangeEventHandler } from "react";

interface Props {
  puzzleLength: number;
  isHidden: boolean;
  puzzleStringStart: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
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
        "my-[2px] h-[2em] w-[98%] select-text border-none bg-white px-1 text-[.85em]",
        isHidden && "hidden",
      )}
      id="grid-string"
      value={puzzleStringStart}
      onChange={onChange}
    />
  );
};

export default PuzzleStringInput;
