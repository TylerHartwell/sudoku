import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
}

const RestartPuzzleBtn = ({ children, onClick }: Props) => {
  return (
    <button
      className="w-min rounded-[10px] text-[clamp(12px,4vw,16px)] active:bg-yellow-200"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default RestartPuzzleBtn
