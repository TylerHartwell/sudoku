import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameInterface = ({ children }: Props) => {
  return (
    <div className="relative flex w-full flex-col sm:w-[max(calc(100vh-145px),300px)] sm:content-center">
      {children}
    </div>
  )
}

export default GameInterface
