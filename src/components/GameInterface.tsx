import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameInterface = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col md:w-[max(calc(100vh-155px),300px)] md:content-center">
      {children}
    </div>
  )
}

export default GameInterface
