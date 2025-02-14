import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const GameContent = ({ children }: Props) => {
  return <div className="w-full md:w-full md:max-w-[max(800px,80vw)] md:px-5 flex flex-col md:flex-row-reverse md:justify-center ">{children}</div>
}

export default GameContent
