import { RuleOutcome } from "@/rules/rulesInterface"
import clsx from "clsx"
interface RuleItemProps {
  ruleN: number
  ruleName: string
  isChecked: boolean
  handleCheckboxChange: () => void
  ruleOutcome: RuleOutcome
  tryRuleAtIndex: () => Promise<RuleOutcome>
  allDefault: boolean
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
          "m-[2px] w-[70px] whitespace-nowrap rounded-[10px] px-[5px] py-[2px] transition-colors duration-500 ease-linear",
          ruleOutcome === "success" && "bg-[green] transition-none",
          ruleOutcome === "fail" && "bg-[red] transition-none",
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
        className="ml-auto whitespace-nowrap text-[clamp(12px,4vw,16px)]"
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
  )
}

export default RuleItem
