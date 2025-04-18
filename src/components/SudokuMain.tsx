import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const SudokuMain = ({ children }: Props) => {
  return (
    <main className="flex flex-col items-center sm:h-max sm:min-h-min sm:w-auto sm:min-w-fit sm:overflow-y-auto sm:overflow-x-hidden">
      {children}
    </main>
  )
}

export default SudokuMain
