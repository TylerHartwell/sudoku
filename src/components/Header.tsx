import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Header = ({ children }: Props) => {
  return (
    <div className="grid h-min grid-cols-3 items-center text-center">
      {children}
    </div>
  )
}

export default Header
