import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Controls = ({ children }: Props) => {
  return (
    <section
      aria-label="Controls"
      className="flex flex-col items-center md:h-[115px]"
    >
      {children}
    </section>
  )
}

export default Controls
