import { symbols } from "@/hooks/useSudokuManagement"
import Square from "./Square"

const Box = ({ boxIndex }: { boxIndex: number }) => {
  return (
    <div className="box aspect-square  grid place-items-center grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr] border-[1px] border-black size-full">
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Square key={index} boxIndex={boxIndex} boxSquareIndex={index} />
      ))}
    </div>
  )
}

export default Box
