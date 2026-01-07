import clsx from "clsx"

interface Props {
  isModeActive: boolean
  onClick: () => void
  children: React.ReactNode
}

const InputModeBtn = ({ isModeActive, onClick, children }: Props) => {
  return (
    <button
      className={clsx(
        "p-1.25 flex h-[90%] w-min items-center justify-center rounded-[10px] border-none text-center text-[clamp(10px,2vw,16px)]",
        isModeActive &&
          "pointer-events-none [text-shadow:1px_0_0_currentColor]",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default InputModeBtn
