import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Controls = ({ children }: Props) => {
  return <section className="controls flex md:h-[115px] flex-col items-center">{children}</section>
}

export default Controls
