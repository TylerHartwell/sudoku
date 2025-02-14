import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PuzzleOperations = ({ children }: Props) => {
  return <div className="w-full md:w-auto md:grow md:min-w-fit md:max-w-[40%] md:overflow-auto md:mr-1 flex flex-col justify-between">{children}</div>
}

export default PuzzleOperations
