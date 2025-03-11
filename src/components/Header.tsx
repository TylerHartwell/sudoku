import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Header = ({ children }: Props) => {
  return (
    <div className="relative flex w-full items-center justify-center">
      {children}
    </div>
  );
};

export default Header;
