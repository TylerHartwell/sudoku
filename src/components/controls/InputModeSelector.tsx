import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const InputModeSelector = ({ children }: Props) => {
  return (
    <section
      aria-label="Input mode"
      className="mx-auto grid w-full grid-cols-[minmax(0,_1fr)_min-content_minmax(0,_1fr)] place-items-center gap-[5px] py-[5px] [&>*:first-child]:justify-self-end [&>*:last-child]:justify-self-start"
    >
      {children}
    </section>
  )
}

export default InputModeSelector
