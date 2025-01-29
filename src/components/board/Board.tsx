import { useContext, useRef } from "react"
import Box from "./Box"
import CandidateContext from "@/contexts/CandidateContext"
import clsx from "clsx"
import { symbolsSqrt, symbols } from "@/hooks/useSudokuManagement"

const Board = () => {
  const { boardIsSolved, entryRefs } = useContext(CandidateContext)

  return (
    <section
      className={clsx(
        `board select-none grid border-black border-[1px]`,
        boardIsSolved && "border-[5px] border-yellow-300",
        symbolsSqrt == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        symbolsSqrt == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        symbolsSqrt == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Box key={index} boxIndex={index} entryRefs={entryRefs} />
      ))}
    </section>
  )
}

export default Board
