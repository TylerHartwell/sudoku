import clsx from "clsx"

interface Props {
  isRightMode: boolean
  onClick: () => void
}

const InputModeSwitch = ({ isRightMode, onClick }: Props) => {
  return (
    <div
      className={clsx(
        "h-[50px] aspect-[2] min-w-[50px] rounded-[25px] relative my-auto duration-300 cursor-pointer",
        isRightMode ? "bg-[#d14141]" : "bg-[rgb(43,143,43)]"
      )}
      onClick={onClick}
    >
      <div
        className={clsx(
          "h-[80%] aspect-square rounded-[50%] bg-white absolute top-[50%] -translate-y-1/2 pointer-events-none duration-300",
          isRightMode ? "left-[calc(100%-5px)] -translate-x-full" : "left-[5px] translate-x-0"
        )}
      ></div>
    </div>
  )
}

export default InputModeSwitch
