import { ReactNode } from "react"
import clsx from "clsx"

interface Props {
  children: ReactNode
  boardIsSolved: boolean
  gridSize: number
}

const Board = ({ children, boardIsSolved, gridSize }: Props) => {
  return (
    <section
      className={clsx(
        `board select-none grid border-black border-[1px]`,
        boardIsSolved && "border-[5px] border-yellow-300",
        gridSize == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        gridSize == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        gridSize == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      {children}
    </section>
  )
}

export default Board
