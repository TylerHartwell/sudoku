import { ReactNode } from "react"
import ThemeSelector from "./ThemeSelector"

interface Props {
  children: ReactNode
}

const MainTitle = ({ children }: Props) => {
  return (
    <h1 className="text-copy/70 col-start-2 whitespace-nowrap text-center text-[clamp(1em,4vw,1.5em)]">
      <span>{children}</span>
    </h1>
  )
}

export default MainTitle
