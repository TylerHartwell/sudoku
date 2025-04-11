import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FetchGroup = ({ children }: Props) => {
  return (
    <div className="grid w-full grid-cols-[1fr_minmax(min-content,_auto)_1fr] text-nowrap pt-1">
      {children}
    </div>
  )
}

export default FetchGroup
