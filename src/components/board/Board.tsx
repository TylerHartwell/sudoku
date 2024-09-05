import { useContext } from "react"
import Box from "./Box"
import CandidateContext from "@/contexts/CandidateContext"

const Board = () => {
  const { boardIsSolved } = useContext(CandidateContext)
  const boardIsSolvedClass = boardIsSolved ? "solved" : ""
  return (
    <section className={`board ${boardIsSolvedClass}`}>
      {Array.from({ length: 9 }).map((_, index) => (
        <Box key={index} boxIndex={index} />
      ))}
    </section>
  )
}

export default Board
