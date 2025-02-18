import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
}

const ClearAllBtn = ({ children, onClick }: Props) => {
  return (
    <button className="w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px]" onClick={onClick}>
      {children}
    </button>
  )
}

export default ClearAllBtn
