import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Actions = ({ children }: Props) => {
  return (
    <div className="relative flex w-full flex-col items-center gap-[2px] overflow-auto">
      {children}
    </div>
  );
};

export default Actions;
