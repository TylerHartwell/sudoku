"use client"

import { useState } from "react"
import { useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"

const Candidate = ({ boxId, squareN, candidateN }: { boxId: number; squareN: number; candidateN: number }) => {
  const [isEliminated, setIsEliminated] = useState(false)
  const { highlightCandidates, showCandidates, candidateMode } = useContext(CandidateContext)

  const toggleEliminated = () => {
    setIsEliminated(prevState => !prevState)
  }

  const highlight: string = candidateN == highlightCandidates && showCandidates && !isEliminated ? "highlight" : ""
  const noPointer: string = !candidateMode ? "no-pointer" : ""

  return (
    <div className={`candidate ${highlight} ${noPointer}`} onClick={toggleEliminated}>
      {!isEliminated && (showCandidates || candidateMode) ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
