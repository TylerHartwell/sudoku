import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameContent = ({ children }: Props) => {
  return (
    <div className="sm:max-w-screen flex w-full flex-col sm:w-full sm:flex-row-reverse sm:justify-center">
      {children}
    </div>
  )
}

export default GameContent
