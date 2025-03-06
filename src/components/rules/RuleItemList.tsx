import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const RuleItemList = ({ children }: Props) => {
  return (
    <ol className="mx-[10px] flex list-none flex-col overflow-auto">
      {children}
    </ol>
  );
};

export default RuleItemList;
