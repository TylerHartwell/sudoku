import { ReactNode } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"

const Square = ({ boxId, squareN }: { boxId: number; squareN: number }) => {
  const rowN = Math.round(Math.floor((boxId - 1) / 3) * 3 + Math.floor((squareN - 1) / 3) + 1)
  const colN = Math.round(((boxId - 1) % 3) * 3 + ((squareN - 1) % 3) + 1)
  const squareId = (rowN - 1) * 9 + colN

  return (
    <div className="square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Candidate key={index} boxId={boxId} squareN={squareN} candidateN={index + 1} />
      ))}
      <Entry boxId={boxId} squareN={squareN} rowN={rowN} colN={colN} squareId={squareId} />
    </div>
  )
}

export default Square
