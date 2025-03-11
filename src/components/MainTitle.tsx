import { ReactNode } from "react";
import ThemeSelector from "./ThemeSelector";

interface Props {
  children: ReactNode;
}

const MainTitle = ({ children }: Props) => {
  return (
    <h1 className="w-min justify-self-center whitespace-nowrap text-center text-[1em] md:h-[40px] md:text-[2em]">
      <span>{children}</span>
    </h1>
  );
};

export default MainTitle;
