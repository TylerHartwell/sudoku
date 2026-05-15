import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
  disabled: boolean
}

const RedoBtn = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      className="w-min rounded-[10px] text-[clamp(10px,3vw,13px)] disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Redo move"
    >
      {children}
    </button>
  )
}

export default RedoBtn
