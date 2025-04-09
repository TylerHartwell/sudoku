import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const SudokuMain = ({ children }: Props) => {
  return (
    <main className="b1 md:max-w-screen grid grid-rows-[min-content_minmax(min-content,_1fr)] md:max-h-screen md:min-h-min md:min-w-min">
      {children}
    </main>
  )
}

export default SudokuMain
