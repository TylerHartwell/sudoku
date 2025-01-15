import { useContext, useMemo } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"
import CandidateContext from "@/contexts/CandidateContext"
import { gridTemplateFRString, symbols, symbolsSqrt } from "@/hooks/useSudokuManagement"

const Square = ({ boxIndex, boxSquareIndex }: { boxIndex: number; boxSquareIndex: number }) => {
  const { puzzleStringCurrent } = useContext(CandidateContext)

  const gridSquareIndex = useMemo(() => {
    const rowIndex = Math.floor(boxIndex / symbolsSqrt) * symbolsSqrt + Math.floor(boxSquareIndex / symbolsSqrt)
    const colIndex = (boxIndex % symbolsSqrt) * symbolsSqrt + (boxSquareIndex % symbolsSqrt)
    const gridSquareIndex = rowIndex * symbols.length + colIndex
    return gridSquareIndex
  }, [boxIndex, boxSquareIndex])

  const shownValue = puzzleStringCurrent[gridSquareIndex] == "0" ? "" : puzzleStringCurrent[gridSquareIndex]

  return (
    <div
      className={`square size-full grid items-center justify-center grid-cols-[${gridTemplateFRString}] grid-rows-[${gridTemplateFRString}] relative border-[1px] border-gray-500 text-[100%]`}
    >
      <Entry gridSquareIndex={gridSquareIndex} shownValue={shownValue} />
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Candidate key={index} gridSquareIndex={gridSquareIndex} candidateIndex={index} entryShownValue={shownValue} />
      ))}
    </div>
  )
}

export default Square
