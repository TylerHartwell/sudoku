import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PuzzleOperations = ({ children }: Props) => {
  return (
    <div className="flex w-full flex-col justify-between md:mr-1 md:w-auto md:min-w-fit md:max-w-[40%] md:grow md:overflow-auto">
      {children}
    </div>
  );
};

export default PuzzleOperations;
