import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ActionBtnGroup = ({ children }: Props) => {
  return <div className="flex w-full justify-between p-[2px]">{children}</div>
}

export default ActionBtnGroup
