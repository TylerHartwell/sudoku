import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const PadNumbers = ({ children }: Props) => {
  return (
    <section aria-label="Number pad" className="w-full flex justify-around items-center py-[10px]">
      {children}
    </section>
  )
}

export default PadNumbers
