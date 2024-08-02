const loneSingle = () => {
  console.log("lonesingle")
  return {
    ruleName: "Lone Single",
    ruleProgresses: () => {
      return false
    },
    ruleResolve: () => {
      console.log("loneSingle resolve")
    }
  }
}

export default loneSingle
