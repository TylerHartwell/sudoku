import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  boxSize: number;
}

const Box = ({ children, boxSize }: Props) => {
  return (
    <div
      className={clsx(
        `border-secondary grid aspect-square size-full place-items-center border-[1px]`,
        boxSize == 2 && "grid-cols-[repeat(2,1fr)] grid-rows-[repeat(2,1fr)]",
        boxSize == 3 && "grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)]",
        boxSize == 4 && "grid-cols-[repeat(4,1fr)] grid-rows-[repeat(4,1fr)]",
      )}
    >
      {children}
    </div>
  );
};

export default Box;
