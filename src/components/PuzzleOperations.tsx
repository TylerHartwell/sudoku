import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PuzzleOperations = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col justify-between sm:w-auto sm:min-w-fit sm:max-w-[40%] sm:grow sm:overflow-auto">
      {children}
    </div>
  )
}

export default PuzzleOperations
