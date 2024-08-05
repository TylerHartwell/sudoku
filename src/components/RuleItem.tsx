import { Rule } from "@/rules/rulesInterface"
import { useState } from "react"

interface RuleItemProps {
  ruleN: number
  rule: Rule
}

const RuleItem = ({ ruleN, rule }: RuleItemProps) => {
  const [ruleOutcome, setRuleOutcome] = useState("")

  function handleRuleAttempt() {
    const ruleProgresses = rule.ruleProgresses()

    const tempRuleOutcome = ruleProgresses ? "success" : "fail"

    setRuleOutcome(tempRuleOutcome)
    setTimeout(() => {
      setRuleOutcome("")
    }, 300)

    if (ruleProgresses) rule.ruleResolve()
  }

  return (
    <li className="rule-item">
      <button className={`try-next-btn ${ruleOutcome}`} onClick={handleRuleAttempt}>
        Attempt
      </button>
      <span className="rule-name">{rule.ruleName}</span>
      <label htmlFor={"checkbox" + ruleN} className="checkbox-label">
        Auto Attempt:
      </label>
      <input type="checkbox" name={"checkbox" + ruleN} id={"checkbox" + ruleN} className="checkbox" />
    </li>
  )
}

export default RuleItem
