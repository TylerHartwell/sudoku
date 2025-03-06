import clsx from "clsx";

interface Props {
  isModeActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const InputModeBtn = ({ isModeActive, onClick, children }: Props) => {
  return (
    <button
      className={clsx(
        "flex h-[90%] w-min items-center justify-center rounded-[10px] border-none bg-transparent p-[5px] text-center text-[clamp(12px,6vw,16px)]",
        isModeActive && "pointer-events-none font-bold",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default InputModeBtn;
