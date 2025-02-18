import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const MainTitle = ({ children }: Props) => {
  return <h1 className="md:h-[40px] text-center text-[1em] md:text-[2em]">{children}</h1>
}

export default MainTitle
