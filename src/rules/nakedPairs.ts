import getRowColBox from "@/utils/sudoku/getRowColBox"
import { Candidate, Rule, Square } from "./rulesInterface"
import getAllSquaresByUnit from "@/utils/sudoku/getAllSquaresByUnit"

const nakedPairs: Rule = {
  ruleName: "Naked Pairs",
  ruleAttempt: ({ allSquares, toggleManualElimCandidate }) => {
    const allSquaresSqrt = Math.sqrt(allSquares.length)

    const allSquaresByUnit: Square[][] = getAllSquaresByUnit(allSquares)
    const groupSize = 2

    for (const [unitIndex, unit] of allSquaresByUnit.entries()) {
      const groupOfSize = []
      for (const square of unit) {
        if (square.entryValue !== "0") continue

        const gridSquareIndex = square.gridSquareIndex
        const candidateObjArr: Candidate[] = []

        for (const [candidateIndex, possible] of square.candidates.entries()) {
          if (possible) {
            candidateObjArr.push({ gridSquareIndex, candidateIndex, possible })
          }
        }

        if (candidateObjArr.length == groupSize) {
          groupOfSize.push(candidateObjArr)
        }
      }

      if (groupOfSize.length >= groupSize) {
        for (let i = 0; i < groupOfSize.length - 1; i++) {
          for (let j = i + 1; j < groupOfSize.length; j++) {
            if (
              groupOfSize[i][0].candidateIndex == groupOfSize[j][0].candidateIndex &&
              groupOfSize[i][1].candidateIndex == groupOfSize[j][1].candidateIndex
            ) {
              const firstIndexOfGroup = groupOfSize[i][0].candidateIndex
              const secondIndexOfGroup = groupOfSize[i][1].candidateIndex
              const firstGroupGridSquareIndex = groupOfSize[i][0].gridSquareIndex
              const secondGroupGridSquareIndex = groupOfSize[j][0].gridSquareIndex

              //eliminate others from unit if present
              const unit = allSquaresByUnit[unitIndex]
              const candidatesToMarkBad: Candidate[] = []
              const actions: (() => void)[] = []

              const processUnit = (unit: Square[]) => {
                for (const square of unit) {
                  const gridSquareIndex = square.gridSquareIndex
                  if (gridSquareIndex !== firstGroupGridSquareIndex && gridSquareIndex !== secondGroupGridSquareIndex) {
                    if (square.candidates[firstIndexOfGroup]) {
                      candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: firstIndexOfGroup, possible: true })
                      actions.push(() => toggleManualElimCandidate(gridSquareIndex, firstIndexOfGroup, true))
                    }
                    if (square.candidates[secondIndexOfGroup]) {
                      candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: secondIndexOfGroup, possible: true })
                      actions.push(() => toggleManualElimCandidate(gridSquareIndex, secondIndexOfGroup, true))
                    }
                  }
                }
              }
              processUnit(unit)

              const isUnitABox = unitIndex % 3 === 2

              if (
                !isUnitABox &&
                getRowColBox(firstGroupGridSquareIndex, allSquaresSqrt).boxIndex == getRowColBox(secondGroupGridSquareIndex, allSquaresSqrt).boxIndex
              ) {
                //eliminate others from box if present
                const unit = allSquaresByUnit[getRowColBox(firstGroupGridSquareIndex, allSquaresSqrt).boxIndex * Math.sqrt(allSquaresSqrt) + 2]
                processUnit(unit)
              }

              if (actions.length !== 0) {
                // console.log("has elimination for pair ", firstIndexOfGroup + 1, "and ", secondIndexOfGroup + 1, "in unit ", unitIndex)
                return {
                  hasProgress: true,
                  candidatesToMarkGood: [
                    { gridSquareIndex: firstGroupGridSquareIndex, candidateIndex: firstIndexOfGroup },
                    { gridSquareIndex: firstGroupGridSquareIndex, candidateIndex: secondIndexOfGroup },
                    { gridSquareIndex: secondGroupGridSquareIndex, candidateIndex: firstIndexOfGroup },
                    { gridSquareIndex: secondGroupGridSquareIndex, candidateIndex: secondIndexOfGroup }
                  ],
                  candidatesToMarkBad,
                  resolve: () => actions.forEach(action => action())
                }
              }
            }
          }
        }
      }
    }

    return { hasProgress: false }
  }
}

export default nakedPairs
