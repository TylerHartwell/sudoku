import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Controls = ({ children }: Props) => {
  return (
    <section aria-label="Controls" className="flex md:h-[115px] flex-col items-center">
      {children}
    </section>
  )
}

export default Controls
