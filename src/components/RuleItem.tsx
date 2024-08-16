import { Rule } from "@/rules/rulesInterface"
import { useState } from "react"

interface RuleItemProps {
  ruleN: number
  rule: Rule
  allSquares: { entryValue: string; candidates: boolean[]; gridSquareIndex: number }[]
  handleCandidateEliminate: any
  handleEntry: any
}

const RuleItem = ({ ruleN, rule, allSquares, handleCandidateEliminate, handleEntry }: RuleItemProps) => {
  const [ruleOutcome, setRuleOutcome] = useState("")
  const [isAutoAttempt, setIsAutoAttempt] = useState(false)

  function handleRuleAttempt() {
    const ruleProgresses = rule.ruleAttempt(allSquares, handleCandidateEliminate, handleEntry)

    const tempRuleOutcome = ruleProgresses ? "success" : "fail"

    setRuleOutcome(tempRuleOutcome)
    setTimeout(() => {
      setRuleOutcome("")
    }, 300)
  }

  function handleCheckboxChange() {
    setIsAutoAttempt(prev => !prev)
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
      <input
        type="checkbox"
        name={"checkbox" + ruleN}
        id={"checkbox" + ruleN}
        className="checkbox"
        checked={isAutoAttempt}
        onChange={handleCheckboxChange}
      />
    </li>
  )
}

export default RuleItem
