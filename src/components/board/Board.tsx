import { ReactNode } from "react"
import clsx from "clsx"

interface Props {
  children: ReactNode
  isBoardSolved: boolean
  gridSize: number
}

const Board = ({ children, isBoardSolved, gridSize }: Props) => {
  return (
    <section
      className={clsx(
        `grid select-none`,
        isBoardSolved
          ? "border-copy border-[5px]"
          : "border-secondary border-[1px]",
        gridSize == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        gridSize == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        gridSize == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]",
      )}
    >
      {children}
    </section>
  )
}

export default Board
