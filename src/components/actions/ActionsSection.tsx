import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ActionsSection = ({ children }: Props) => {
  return (
    <section aria-label="Actions" className="mt-[10px] md:mt-0 flex flex-col justify-start items-center ">
      {children}
    </section>
  )
}

export default ActionsSection
