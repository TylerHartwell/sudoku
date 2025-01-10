import { useContext } from "react"
import Box from "./Box"
import CandidateContext from "@/contexts/CandidateContext"
import clsx from "clsx"
import { symbols } from "@/hooks/useSudokuManagement"

const Board = () => {
  const { boardIsSolved } = useContext(CandidateContext)

  return (
    <section
      className={clsx(
        "board select-none grid grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr] border-black border-[1px] ",
        boardIsSolved && "border-[5px] border-yellow-300"
      )}
    >
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Box key={index} boxIndex={index} />
      ))}
    </section>
  )
}

export default Board
