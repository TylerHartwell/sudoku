import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const FetchGroup = ({ children }: Props) => {
  return (
    <div className="grid w-full grid-cols-[1fr_minmax(min-content,_2fr)_1fr] pt-1">
      {children}
    </div>
  )
}

export default FetchGroup
