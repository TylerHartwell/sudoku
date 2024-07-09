import { ReactNode } from "react"
import Box from "./Box"

const Board = () => {
  const boardData = {
    isSet: false,
    isCandidateMode: false,
    allBoxes: [],
    allSquares: [],
    allEntries: [],
    allCandidates: []
  }

  return (
    <section className="board">
      {Array.from({ length: 9 }).map((_, index) => (
        <Box key={index} />
      ))}
    </section>
  )
}

export default Board
