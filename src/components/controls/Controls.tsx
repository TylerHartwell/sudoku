import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Controls = ({ children }: Props) => {
  return (
    <section
      aria-label="Controls"
      className="flex w-full min-w-min flex-col items-center"
    >
      {children}
    </section>
  )
}

export default Controls
