interface RuleItemProps {
  ruleN: number
  rule: () => {
    ruleName: string
    ruleProgresses: () => boolean
    ruleResolve: () => void
  }
}

const RuleItem = ({ ruleN, rule }: RuleItemProps) => {
  const ruleObj = rule()

  function handleRuleAttempt() {}

  return (
    <li className="rule-item">
      <button className="try-next-btn" onClick={handleRuleAttempt}>
        Attempt
      </button>
      <span className="rule-name">{ruleObj.ruleName}</span>
      <label htmlFor={"checkbox" + ruleN} className="checkbox-label">
        Auto Attempt:
      </label>
      <input type="checkbox" name={"checkbox" + ruleN} id={"checkbox" + ruleN} className="checkbox" />
    </li>
  )
}

export default RuleItem
