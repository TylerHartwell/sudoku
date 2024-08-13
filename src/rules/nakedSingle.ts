import { Rule } from "./rulesInterface"

const nakedSingle: Rule = {
  ruleName: "Naked Single",
  ruleAttempt: (allSquares: { entryValue: string; candidates: boolean[] }[]) => {
    console.log("naked single attempt")
    return false
  }
}

export default nakedSingle
