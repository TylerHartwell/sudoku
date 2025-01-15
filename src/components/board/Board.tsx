import { useContext } from "react"
import Box from "./Box"
import CandidateContext from "@/contexts/CandidateContext"
import clsx from "clsx"
import { gridTemplateFRString, symbols } from "@/hooks/useSudokuManagement"

const Board = () => {
  const { boardIsSolved } = useContext(CandidateContext)

  return (
    <section
      className={clsx(
        `board select-none grid grid-cols-[${gridTemplateFRString}] grid-rows-[${gridTemplateFRString}] border-black border-[1px]`,
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
