import { Rule } from "./rulesInterface"

const nakedSingle: Rule = {
  ruleName: "Naked Single",
  ruleProgresses: () => {
    return false
  },
  ruleResolve: () => {
    console.log("nakedSingle resolve")
  }
}

export default nakedSingle
