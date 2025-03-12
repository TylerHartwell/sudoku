import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const SectionTitle = ({ children }: Props) => {
  return <h2 className="text-center">{children}</h2>
}

export default SectionTitle
