import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PadNumbers = ({ children }: Props) => {
  return (
    <section
      aria-label="Number pad"
      className="flex w-full items-center justify-around py-[10px]"
    >
      {children}
    </section>
  );
};

export default PadNumbers;
