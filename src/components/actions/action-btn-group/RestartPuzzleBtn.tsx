import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
}

const RestartPuzzleBtn = ({ children, onClick }: Props) => {
  return (
    <button
      className="w-min rounded-[10px] text-[clamp(10px,3vw,13px)] active:bg-yellow-200"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default RestartPuzzleBtn
