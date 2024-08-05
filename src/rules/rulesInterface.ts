export interface Rule {
  ruleName: string
  ruleProgresses: () => boolean
  ruleResolve: () => void
}
