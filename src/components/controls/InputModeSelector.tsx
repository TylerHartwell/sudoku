import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const InputModeSelector = ({ children }: Props) => {
  return (
    <section
      aria-label="Input mode"
      className="gap-1.25 mx-auto grid min-w-min grid-cols-[minmax(0,1fr)_min-content_minmax(0,1fr)] place-items-center [&>*:first-child]:justify-self-end [&>*:last-child]:justify-self-start"
    >
      {children}
    </section>
  )
}

export default InputModeSelector
