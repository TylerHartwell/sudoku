import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const Header = ({ children }: Props) => {
  return (
    <div className="grid h-min w-full grid-cols-3 items-center text-center sm:max-w-[max(640px,80vw)]">
      {children}
    </div>
  )
}

export default Header
