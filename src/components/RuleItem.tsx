import { RuleOutcome } from "@/rules/rulesInterface"
import clsx from "clsx"
interface RuleItemProps {
  ruleN: number
  ruleName: string
  isChecked: boolean
  handleCheckboxChange: () => void
  ruleOutcome: RuleOutcome
  tryRuleAtIndex: () => Promise<boolean>
  allDefault: boolean
}

const RuleItem = ({ ruleN, ruleName, isChecked, handleCheckboxChange, ruleOutcome, tryRuleAtIndex, allDefault }: RuleItemProps) => {
  return (
    <li className="flex justify-between items-center h-[30px] border-none">
      <button
        className={clsx(
          "try-next-btn border-none rounded-[10px] m-[2px] px-[5px] py-[2px] shadow-[black_0px_0px_4px] whitespace-nowrap w-[70px] transition-colors ease-out duration-300",
          ruleOutcome === "success" && "bg-[green]",
          ruleOutcome === "fail" && "bg-[red]"
        )}
        onClick={tryRuleAtIndex}
        disabled={!allDefault}
      >
        Attempt
      </button>
      <span className="mx-[10px] whitespace-nowrap">{ruleName}</span>
      <label htmlFor={"checkbox" + ruleN} className="border-none ml-auto whitespace-nowrap">
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
