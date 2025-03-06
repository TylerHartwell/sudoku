import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SudokuMain = ({ children }: Props) => {
  return (
    <main className="flex flex-col items-center md:h-max md:min-h-min md:w-auto md:min-w-fit md:overflow-y-auto">
      {children}
    </main>
  );
};

export default SudokuMain;
