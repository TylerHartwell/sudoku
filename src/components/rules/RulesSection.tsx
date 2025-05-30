import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const RulesSection = ({ children }: Props) => {
  return (
    <section aria-label="Rules" className="text-center">
      {children}
    </section>
  )
}

export default RulesSection
