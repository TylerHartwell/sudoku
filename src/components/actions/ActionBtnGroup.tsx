import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ActionBtnGroup = ({ children }: Props) => {
  return <div className="flex justify-between w-full p-[2px] min-w-0">{children}</div>
}

export default ActionBtnGroup
