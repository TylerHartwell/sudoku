import { ReactNode } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"

const Square = ({ boxId, squareN }: { boxId: number; squareN: number }) => {
  return (
    <div className="square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Candidate key={index} boxId={boxId} squareN={squareN} candidateN={index + 1} isCandidatesOn={true} />
      ))}
      <Entry boxId={boxId} squareN={squareN} />
    </div>
  )
}

export default Square
