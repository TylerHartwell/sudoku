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
        `border-secondary grid place-items-center border-2`,
        boxSize == 2 &&
          // text: 100 / (2*2) = 25cqw
          "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] text-[25cqw]",
        boxSize == 3 &&
          // text: 100 / (3*3) = 11.11cqw
          "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] text-[11.11cqw]",
        boxSize == 4 &&
          // text: 100 / (4*4) = 6.25cqw
          "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)] text-[6.25cqw]",
      )}
    >
      {children}
    </div>
  )
}

export default Box
