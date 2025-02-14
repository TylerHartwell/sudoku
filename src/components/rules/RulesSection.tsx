import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const RulesSection = ({ children }: Props) => {
  return (
    <section aria-label="Rules" className="mt-[10px] md:mt-0 text-center">
      {children}
    </section>
  )
}

export default RulesSection
