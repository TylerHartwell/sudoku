"use client"

import { useState } from "react"
import { useContext } from "react"
import CandidateHighlightContext from "@/contexts/CandidateHighlightContext"

const Candidate = ({
  boxId,
  squareN,
  candidateN,
  isCandidatesOn
}: {
  boxId: number
  squareN: number
  candidateN: number
  isCandidatesOn: boolean
}) => {
  const [isEliminated, setIsEliminated] = useState(false)
  const isHighlighted = useContext(CandidateHighlightContext)

  const toggleEliminated = () => {
    setIsEliminated(prevState => !prevState)
  }

  // const eliminate = () => {
  //   if (!isEliminated) setIsEliminated(true)
  // }

  // const uneliminate = () => {
  //   if (isEliminated) setIsEliminated(false)
  // }

  return (
    <div className={`candidate ${isHighlighted ? "highlight" : ""}`} onClick={toggleEliminated}>
      {!isEliminated && isCandidatesOn ? candidateN.toString() : ""}
    </div>
  )
}

export default Candidate
