import { RuleOutcome } from "@/rules/rulesInterface"
interface RuleItemProps {
  ruleN: number
  ruleName: string
  isChecked: boolean
  handleCheckboxChange: () => void
  ruleOutcome: RuleOutcome
  tryRuleAtIndex: () => boolean
}

const RuleItem = ({ ruleN, ruleName, isChecked, handleCheckboxChange, ruleOutcome, tryRuleAtIndex }: RuleItemProps) => {
  return (
    <li className="rule-item">
      <button className={`try-next-btn ${ruleOutcome}`} onClick={tryRuleAtIndex}>
        Attempt
      </button>
      <span className="rule-name">{ruleName}</span>
      <label htmlFor={"checkbox" + ruleN} className="checkbox-label">
        Auto Attempt:
      </label>
      <input
        type="checkbox"
        name={"checkbox" + ruleN}
        id={"checkbox" + ruleN}
        className="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </li>
  )
}

export default RuleItem
