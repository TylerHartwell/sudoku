import { Rule } from "./rulesInterface"

// if a square has only one remaining candidate number, that number can be entered in that square

const nakedSingle: Rule = {
  ruleName: "Naked Single",
  ruleAttempt: ({ allSquares, handleEntry }) => {
    for (const [gridSquareIndex, square] of allSquares.entries()) {
      let possibleCount = 0
      let targetCandidateIndex
      for (const [candidateIndex, possible] of square.candidates.entries()) {
        if (possible) {
          possibleCount++
          if (possibleCount > 1) break
          targetCandidateIndex = candidateIndex
        }
      }
      if (possibleCount > 1 || possibleCount == 0) continue

      const candidateIndex = targetCandidateIndex as number
      const candidateNumber = candidateIndex + 1
      console.log("naked single of ", candidateNumber, "at ", gridSquareIndex)

      return {
        hasProgress: true,
        candidatesToMarkGood: [{ gridSquareIndex, candidateIndex }],
        resolve: () => handleEntry(gridSquareIndex, candidateNumber.toString())
      }
    }
    return { hasProgress: false }
  }
}

export default nakedSingle
