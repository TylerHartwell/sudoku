import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
  disabled: boolean
}

const ToggleCandidatesBtn = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      className="w-min justify-self-end rounded-[10px] text-[clamp(12px,4vw,16px)] disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ToggleCandidatesBtn
