import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PuzzleOperations = ({ children }: Props) => {
  return (
    <div className="flex flex-col md:min-w-min md:justify-between">
      {children}
    </div>
  )
}

export default PuzzleOperations
