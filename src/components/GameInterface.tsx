import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameInterface = ({ children }: Props) => {
  return (
    <div className="grid grid-rows-[1fr_min-content] md:order-1">
      {children}
    </div>
  )
}

export default GameInterface
