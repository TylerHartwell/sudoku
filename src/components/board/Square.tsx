import { ReactNode } from "react"
import Candidate from "./Candidate"
import Entry from "./Entry"

const Square = () => {
  return (
    <div className="square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Candidate key={index} candidateNumber={index + 1} />
      ))}
      <Entry />
    </div>
  )
}

export default Square
