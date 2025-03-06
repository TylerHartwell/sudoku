import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const RulesSection = ({ children }: Props) => {
  return (
    <section aria-label="Rules" className="mt-[10px] text-center md:mt-0">
      {children}
    </section>
  );
};

export default RulesSection;
