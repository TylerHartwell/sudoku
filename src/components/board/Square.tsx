import { useContext, useMemo } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"
import CandidateContext from "@/contexts/CandidateContext"

const Square = ({ boxIndex, boxSquareIndex }: { boxIndex: number; boxSquareIndex: number }) => {
  const { puzzleStringCurrent } = useContext(CandidateContext)

  const gridSquareIndex = useMemo(() => {
    const rowIndex = Math.floor(boxIndex / 3) * 3 + Math.floor(boxSquareIndex / 3)
    const colIndex = (boxIndex % 3) * 3 + (boxSquareIndex % 3)
    const gridSquareIndex = rowIndex * 9 + colIndex

    return gridSquareIndex
  }, [boxIndex, boxSquareIndex])

  const shownValue = puzzleStringCurrent[gridSquareIndex] == "0" ? "" : puzzleStringCurrent[gridSquareIndex]

  return (
    <div className="square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Candidate key={index} gridSquareIndex={gridSquareIndex} candidateIndex={index} entryShownValue={shownValue} />
      ))}
      <Entry gridSquareIndex={gridSquareIndex} shownValue={shownValue} />
    </div>
  )
}

export default Square
