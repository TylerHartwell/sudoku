import { ReactNode } from "react"

interface Props {
  children: ReactNode
  onClick: () => void
  disabled: boolean
}

const ToggleCandidatesBtn = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      className="toggle-candidates-btn w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px] justify-self-end disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default ToggleCandidatesBtn
