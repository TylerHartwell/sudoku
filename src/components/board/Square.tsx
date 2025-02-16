import { ReactNode } from "react"
import clsx from "clsx"

interface Props {
  children: ReactNode
  squareSize: number
}

const Square = ({ children, squareSize }: Props) => {
  return (
    <div
      className={clsx(
        `square size-full grid items-center justify-center relative border-[1px] border-gray-500 text-[100%]`,
        squareSize == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        squareSize == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        squareSize == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      {children}
    </div>
  )
}

export default Square
