import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameContent = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col sm:w-full sm:max-w-[max(640px,80vw)] sm:flex-row-reverse sm:justify-center">
      {children}
    </div>
  )
}

export default GameContent
