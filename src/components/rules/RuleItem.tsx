import { RuleOutcome } from "@/rules/rulesInterface";
import clsx from "clsx";
interface RuleItemProps {
  ruleN: number;
  ruleName: string;
  isChecked: boolean;
  handleCheckboxChange: () => void;
  ruleOutcome: RuleOutcome;
  tryRuleAtIndex: () => Promise<RuleOutcome>;
  allDefault: boolean;
}

const RuleItem = ({
  ruleN,
  ruleName,
  isChecked,
  handleCheckboxChange,
  ruleOutcome,
  tryRuleAtIndex,
  allDefault,
}: RuleItemProps) => {
  return (
    <li className="flex h-[30px] items-center justify-between p-1">
      <button
        className={clsx(
          "m-[2px] w-[70px] whitespace-nowrap rounded-[10px] border-none px-[5px] py-[2px] shadow-[black_0px_0px_4px] transition-colors duration-300 ease-out",
          ruleOutcome === "success" && "bg-[green]",
          ruleOutcome === "fail" && "bg-[red]",
        )}
        onClick={tryRuleAtIndex}
        disabled={!allDefault}
      >
        Attempt
      </button>
      <span className="mx-[10px] whitespace-nowrap text-[clamp(12px,4vw,16px)]">
        {ruleName}
      </span>
      <label
        htmlFor={"checkbox" + ruleN}
        className="ml-auto whitespace-nowrap border-none text-[clamp(12px,4vw,16px)]"
      >
        Auto:
      </label>
      <input
        type="checkbox"
        name={"checkbox" + ruleN}
        id={"checkbox" + ruleN}
        className="ml-[5px]"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </li>
  );
};

export default RuleItem;
