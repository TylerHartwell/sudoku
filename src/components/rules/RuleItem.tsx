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
    <li className="h-7.5 flex items-center justify-between p-1">
      <button
        className={clsx(
          "px-1.25 whitespace-nowrap rounded-[10px] py-0.5 transition-colors duration-500 ease-linear",
          ruleOutcome === "success" && "bg-[green] transition-none",
          ruleOutcome === "fail" && "bg-[red] transition-none",
        )}
        onClick={tryRuleAtIndex}
        disabled={!allDefault}
      >
        Attempt
      </button>
      <span className="mx-2.5 text-start text-[clamp(12px,4vw,16px)]">
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
        className="ml-1.25"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </li>
  )
}

export default RuleItem
