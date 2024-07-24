import { useContext, useEffect, useState } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"
import CandidateContext from "@/contexts/CandidateContext"

const Square = ({ boxIndex, boxSquareIndex }: { boxIndex: number; boxSquareIndex: number }) => {
  const { puzzleStringCurrent } = useContext(CandidateContext)
  const rowIndex = Math.floor(boxIndex / 3) * 3 + Math.floor(boxSquareIndex / 3)
  const colIndex = (boxIndex % 3) * 3 + (boxSquareIndex % 3)
  const gridSquareIndex = rowIndex * 9 + colIndex

  const shownValue = puzzleStringCurrent[gridSquareIndex] == "0" ? "" : puzzleStringCurrent[gridSquareIndex]

  return (
    <div className="square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Candidate
          key={index}
          boxIndex={boxIndex}
          rowIndex={rowIndex}
          colIndex={colIndex}
          candidateN={index + 1}
          gridSquareIndex={gridSquareIndex}
          entryShownValue={shownValue}
        />
      ))}
      <Entry
        gridSquareIndex={gridSquareIndex}
        shownValue={shownValue}
        boxIndex={boxIndex}
        rowIndex={rowIndex}
        colIndex={colIndex}
      />
    </div>
  )
}

export default Square
