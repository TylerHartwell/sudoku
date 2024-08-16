import { Rule } from "./rulesInterface"

const loneSingle: Rule = {
  ruleName: "Lone Single",
  ruleAttempt: (allSquares, handleCandidateEliminate, handleEntry) => {
    console.log("lone single attempt")
    console.log(allSquares)
    for (const [squareIndex, square] of allSquares.entries()) {
      let candidatateCount = 0
      let candidateNumber = 0
      for (const [candidateIndex, candidate] of square.candidates.entries()) {
        if (candidate) {
          candidatateCount++
          if (candidatateCount > 1) break
          candidateNumber = candidateIndex + 1
        }
      }
      if (candidatateCount > 1 || candidatateCount == 0) continue
      handleEntry(squareIndex, candidateNumber.toString())
      console.log("lone single of ", candidateNumber)
      return true
    }
    console.log("no lone singles")
    return false
  }
}

export default loneSingle
