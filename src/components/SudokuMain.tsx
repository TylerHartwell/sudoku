import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const SudokuMain = ({ children }: Props) => {
  return <main className="primary md:w-auto md:min-w-fit md:h-max md:min-h-min flex flex-col items-center md:overflow-y-auto ">{children}</main>
}

export default SudokuMain
