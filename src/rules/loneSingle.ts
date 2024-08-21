import { Rule } from "./rulesInterface"

const loneSingle: Rule = {
  ruleName: "Lone Single",
  ruleAttempt: (allSquares, handleCandidateEliminate, handleEntry) => {
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

      console.log("lone single of ", candidateNumber, "at ", squareIndex)
      return () => handleEntry(squareIndex, candidateNumber.toString())
    }
    console.log("no lone singles")
    return false
  }
}

export default loneSingle
