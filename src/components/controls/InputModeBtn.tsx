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
        "flex h-[90%] w-min items-center justify-center rounded-[10px] border-none p-[5px] text-center text-[clamp(10px,_2vw,_16px)]",
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
