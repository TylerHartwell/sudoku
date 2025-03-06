import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MainTitle = ({ children }: Props) => {
  return (
    <h1 className="text-center text-[1em] md:h-[40px] md:text-[2em]">
      {children}
    </h1>
  );
};

export default MainTitle;
