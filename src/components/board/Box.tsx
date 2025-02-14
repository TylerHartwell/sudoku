import { symbolsSqrt } from "@/hooks/useSudokuManagement"

import clsx from "clsx"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  boxSize: number
}

const Box = ({ children, boxSize }: Props) => {
  return (
    <div
      className={clsx(
        `box aspect-square grid place-items-center border-[1px] border-black size-full`,
        boxSize == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        boxSize == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        boxSize == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]"
      )}
    >
      {children}
    </div>
  )
}

export default Box
