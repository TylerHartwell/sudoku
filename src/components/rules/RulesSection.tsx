import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const RulesSection = ({ children }: Props) => {
  return (
    <section aria-label="Rules" className="mt-[10px] text-center">
      {children}
    </section>
  )
}

export default RulesSection
