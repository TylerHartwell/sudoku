import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FetchGroup = ({ children }: Props) => {
  return (
    <div className="grid w-full grid-cols-[1fr_minmax(min-content,_auto)_1fr] items-center gap-2 text-nowrap pr-1">
      {children}
    </div>
  )
}

export default FetchGroup
