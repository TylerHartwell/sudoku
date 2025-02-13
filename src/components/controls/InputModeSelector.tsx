import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const InputModeSelector = ({ children }: Props) => {
  return (
    <section aria-label="Input mode" className="w-full flex py-[5px] mx-auto justify-center items-center gap-[5px]">
      {children}
    </section>
  )
}

export default InputModeSelector
