import clsx from "clsx"

interface Props {
  isRightMode: boolean
  onClick: () => void
}

const InputModeSwitch = ({ isRightMode, onClick }: Props) => {
  return (
    <div
      className={clsx(
        "border-secondary group relative my-auto aspect-[2] h-[50px] min-w-[50px] cursor-pointer rounded-[25px] border-[3px] duration-300 ease-in-out",
        isRightMode ? "bg-[#d14141]" : "bg-[rgb(43,143,43)]",
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          "pointer-events-none absolute top-[50%] aspect-square h-[80%] -translate-y-1/2 rounded-[50%] bg-white duration-300 ease-in-out",
          isRightMode
            ? "left-[calc(100%-5px)] -translate-x-full group-hover:left-[calc(100%-7px)] group-hover:bg-white/90"
            : "left-[5px] translate-x-0 group-hover:left-[7px] group-hover:bg-white/90",
        )}
      ></div>
    </div>
  )
}

export default InputModeSwitch
