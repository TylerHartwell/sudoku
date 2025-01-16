import { useContext, useMemo } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"
import CandidateContext from "@/contexts/CandidateContext"
import { symbols, symbolsSqrt } from "@/hooks/useSudokuManagement"
import clsx from "clsx"

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
      className={clsx(
        `square size-full grid items-center justify-center relative border-[1px] border-gray-500 text-[100%]`,
        symbolsSqrt == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        symbolsSqrt == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        symbolsSqrt == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      <Entry gridSquareIndex={gridSquareIndex} shownValue={shownValue} />
      {Array.from({ length: symbols.length }).map((_, index) => (
        <Candidate key={index} gridSquareIndex={gridSquareIndex} candidateIndex={index} entryShownValue={shownValue} />
      ))}
    </div>
  )
}

export default Square
