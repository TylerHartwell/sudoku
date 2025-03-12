import getAllSquaresByUnit from "@/utils/sudoku/getAllSquaresByUnit"
import { Rule, Square } from "./rulesInterface"

// if a unit has only one square remaining that has a particular candidate number, that number can be entered in that square

const hiddenSingle: Rule = {
  ruleName: "Hidden Single",
  ruleAttempt: ({ allSquares, handleEntry }) => {
    const allSquaresByUnit: Square[][] = getAllSquaresByUnit(allSquares)

    const allSquaresSqrt = Math.sqrt(allSquares.length)

    for (const unit of allSquaresByUnit) {
      for (
        let candidateIndex = 0;
        candidateIndex < allSquaresSqrt;
        candidateIndex++
      ) {
        let instanceCount = 0
        let targetGridSquareIndex: number | null = null
        for (const square of unit) {
          if (instanceCount > 1) break
          if (square.entryValue != "0") continue
          if (square.candidates[candidateIndex]) {
            if (square.candidates.filter(Boolean).length === 1) {
              targetGridSquareIndex = null
              break
            }
            instanceCount++
            targetGridSquareIndex = square.gridSquareIndex
          }
        }
        if (instanceCount === 1 && targetGridSquareIndex !== null) {
          const candidateNumber = candidateIndex + 1
          const gridSquareIndex = targetGridSquareIndex //narrow type to number
          // console.log("hidden single of ", candidateNumber, "at ", gridSquareIndex)
          return {
            hasProgress: true,
            candidatesToMarkGood: [{ gridSquareIndex, candidateIndex }],
            resolve: () =>
              handleEntry(gridSquareIndex, candidateNumber.toString()),
          }
        }
      }
    }
    return { hasProgress: false }
  },
}

export default hiddenSingle
