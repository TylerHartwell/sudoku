import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const InputModeSelector = ({ children }: Props) => {
  return (
    <section
      aria-label="Input mode"
      className="mx-auto flex w-full items-center justify-center gap-[5px] py-[5px]"
    >
      {children}
    </section>
  );
};

export default InputModeSelector;
