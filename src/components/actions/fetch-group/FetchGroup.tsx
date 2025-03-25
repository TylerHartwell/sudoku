import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FetchGroup = ({ children }: Props) => {
  return (
    <div className="grid w-full grid-cols-[1fr_minmax(min-content,_auto)_1fr] text-nowrap pt-1 md:grid-cols-[minmax(min-content,_auto)_minmax(min-content,_auto)_min-content]">
      {children}
    </div>
  )
}

export default FetchGroup
