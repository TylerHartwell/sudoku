import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PadNumbers = ({ children }: Props) => {
  return (
    <section
      aria-label="Number pad"
      className="@container flex w-full items-center justify-around"
    >
      {children}
    </section>
  )
}

export default PadNumbers
