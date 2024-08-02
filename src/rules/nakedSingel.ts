const nakedSingle = () => {
  console.log("nakedSingle")
  return {
    ruleName: "Naked Single",
    ruleProgresses: () => {
      return true
    },
    ruleResolve: () => {
      console.log("nakedSingle resolve")
    }
  }
}

export default nakedSingle
