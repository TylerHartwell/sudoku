import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FetchGroup = ({ children }: Props) => {
  return <div className="w-full grid grid-cols-3  pt-1">{children}</div>
}

export default FetchGroup
