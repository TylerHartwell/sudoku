import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
  disabled: boolean
}

const UndoBtn = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      className="w-min rounded-[10px] text-[clamp(10px,3vw,13px)] disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Undo last move"
    >
      {children}
    </button>
  )
}

export default UndoBtn
