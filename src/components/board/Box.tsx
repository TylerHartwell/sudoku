import { symbolsSqrt, symbols } from "@/hooks/useSudokuManagement"
import Square from "./Square"
import clsx from "clsx"

const Box = ({ boxIndex }: { boxIndex: number }) => {
  return (
    <div
      className={clsx(
        `box aspect-square grid place-items-center border-[1px] border-black size-full`,
        symbolsSqrt == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        symbolsSqrt == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        symbolsSqrt == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Square key={index} boxIndex={boxIndex} boxSquareIndex={index} />
      ))}
    </div>
  )
}

export default Box
