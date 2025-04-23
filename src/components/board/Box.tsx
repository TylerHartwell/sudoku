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
        `border-secondary grid place-items-center border-[2px]`,
        boxSize == 2 &&
          "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)] text-[calc(100cqw/4)]",
        boxSize == 3 &&
          "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] text-[calc(100cqw/9)]",
        boxSize == 4 &&
          "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)] text-[calc(100cqw/16)]",
      )}
    >
      {children}
    </div>
  )
}

export default Box
