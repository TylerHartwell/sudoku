import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ActionsSection = ({ children }: Props) => {
  return (
    <section
      aria-label="Actions"
      className="mt-[10px] flex flex-col items-center justify-start md:mt-0"
    >
      {children}
    </section>
  )
}

export default ActionsSection
