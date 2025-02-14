import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameInterface = ({ children }: Props) => {
  return <div className="w-full md:w-[max(calc(100vh-155px),300px)] flex flex-col md:content-center">{children}</div>
}

export default GameInterface
