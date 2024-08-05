import { Rule } from "./rulesInterface"

const loneSingle: Rule = {
  ruleName: "Lone Single",
  ruleProgresses: () => {
    return true
  },
  ruleResolve: () => {
    console.log("loneSingle resolve")
  }
}

export default loneSingle
