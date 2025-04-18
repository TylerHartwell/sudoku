import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const RuleItemList = ({ children }: Props) => {
  return (
    <ol className="mx-[10px] flex list-none flex-col gap-1 overflow-auto py-1">
      {children}
    </ol>
  )
}

export default RuleItemList
