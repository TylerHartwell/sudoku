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
        "h-[90%] w-min border-none flex rounded-[10px] p-[5px] text-center text-[clamp(12px,6vw,16px)] justify-center items-center bg-transparent",
        isModeActive && "font-bold pointer-events-none"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default InputModeBtn
