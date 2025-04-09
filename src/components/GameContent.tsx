import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameContent = ({ children }: Props) => {
  return (
    <div className="grid h-full w-full grid-rows-[minmax(0,_1fr)_min-content] md:grid-cols-[minmax(min-content,_40%)_1fr] md:grid-rows-none">
      {children}
    </div>
  )
}

export default GameContent
