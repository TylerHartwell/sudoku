import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GameContent = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col md:w-full md:max-w-[max(800px,80vw)] md:flex-row-reverse md:justify-center md:px-5">
      {children}
    </div>
  );
};

export default GameContent;
