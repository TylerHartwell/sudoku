import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ActionsSection = ({ children }: Props) => {
  return (
    <section
      aria-label="Actions"
      className="flex flex-col items-center justify-start sm:mt-0"
    >
      {children}
    </section>
  )
}

export default ActionsSection
