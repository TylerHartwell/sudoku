import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
}

const SetPuzzleBtn = ({ children, onClick }: Props) => {
  return (
    <button
      className="set-puzzle-btn w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px] active:bg-yellow-200"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default SetPuzzleBtn
