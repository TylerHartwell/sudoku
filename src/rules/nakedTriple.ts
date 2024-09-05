import getRowColBox from "@/utils/getRowColBox"
import { Candidate, Rule, Square } from "./rulesInterface"
import getAllSquaresByUnit from "@/utils/getAllSquaresByUnit"

const nakedTriple: Rule = {
  ruleName: "Naked Triple",
  ruleAttempt: ({ allSquares, toggleManualElimCandidate }) => {
    const allSquaresByUnit: Square[][] = getAllSquaresByUnit(allSquares)
    const groupSize = 3

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
        for (let i = 0; i < groupOfSize.length - 2; i++) {
          for (let j = i + 1; j < groupOfSize.length - 1; j++) {
            for (let k = j + 1; k < groupOfSize.length; k++) {
              if (
                groupOfSize[i][0].candidateIndex == groupOfSize[j][0].candidateIndex &&
                groupOfSize[j][0].candidateIndex == groupOfSize[k][0].candidateIndex &&
                groupOfSize[i][1].candidateIndex == groupOfSize[j][1].candidateIndex &&
                groupOfSize[j][1].candidateIndex == groupOfSize[k][1].candidateIndex &&
                groupOfSize[i][2].candidateIndex == groupOfSize[j][2].candidateIndex &&
                groupOfSize[j][2].candidateIndex == groupOfSize[k][2].candidateIndex
              ) {
                const firstIndexOfGroup = groupOfSize[i][0].candidateIndex
                const secondIndexOfGroup = groupOfSize[i][1].candidateIndex
                const thirdIndexOfGroup = groupOfSize[i][2].candidateIndex
                const firstGroupGridSquareIndex = groupOfSize[i][0].gridSquareIndex
                const secondGroupGridSquareIndex = groupOfSize[j][0].gridSquareIndex
                const thirdGroupGridSquareIndex = groupOfSize[k][0].gridSquareIndex

                //eliminate others from unit if present
                const unit = allSquaresByUnit[unitIndex]
                const candidatesToMarkBad: Candidate[] = []
                const actions: (() => void)[] = []

                const processUnit = (unit: Square[]) => {
                  for (const square of unit) {
                    const gridSquareIndex = square.gridSquareIndex
                    if (
                      gridSquareIndex !== firstGroupGridSquareIndex &&
                      gridSquareIndex !== secondGroupGridSquareIndex &&
                      gridSquareIndex !== thirdGroupGridSquareIndex
                    ) {
                      if (square.candidates[firstIndexOfGroup]) {
                        candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: firstIndexOfGroup, possible: true })
                        actions.push(() => toggleManualElimCandidate(gridSquareIndex, firstIndexOfGroup, true))
                      }
                      if (square.candidates[secondIndexOfGroup]) {
                        candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: secondIndexOfGroup, possible: true })
                        actions.push(() => toggleManualElimCandidate(gridSquareIndex, secondIndexOfGroup, true))
                      }
                      if (square.candidates[thirdIndexOfGroup]) {
                        candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: thirdIndexOfGroup, possible: true })
                        actions.push(() => toggleManualElimCandidate(gridSquareIndex, thirdIndexOfGroup, true))
                      }
                    }
                  }
                }
                processUnit(unit)

                const isUnitABox = unitIndex % 3 === 2

                if (
                  !isUnitABox &&
                  getRowColBox(firstGroupGridSquareIndex).boxIndex == getRowColBox(secondGroupGridSquareIndex).boxIndex &&
                  getRowColBox(secondGroupGridSquareIndex).boxIndex == getRowColBox(thirdGroupGridSquareIndex).boxIndex
                ) {
                  //eliminate others from box if present
                  const unit = allSquaresByUnit[getRowColBox(firstGroupGridSquareIndex).boxIndex * 3 + 2]
                  processUnit(unit)
                }

                if (actions.length !== 0) {
                  console.log(
                    "has elimination for triple ",
                    firstIndexOfGroup + 1,
                    "and ",
                    secondIndexOfGroup + 1,
                    "and ",
                    thirdIndexOfGroup + 1,
                    "in unit ",
                    unitIndex
                  )
                  return {
                    hasProgress: true,
                    candidatesToMarkGood: [
                      { gridSquareIndex: firstGroupGridSquareIndex, candidateIndex: firstIndexOfGroup },
                      { gridSquareIndex: firstGroupGridSquareIndex, candidateIndex: secondIndexOfGroup },
                      { gridSquareIndex: firstGroupGridSquareIndex, candidateIndex: thirdIndexOfGroup },
                      { gridSquareIndex: secondGroupGridSquareIndex, candidateIndex: firstIndexOfGroup },
                      { gridSquareIndex: secondGroupGridSquareIndex, candidateIndex: secondIndexOfGroup },
                      { gridSquareIndex: secondGroupGridSquareIndex, candidateIndex: thirdIndexOfGroup },
                      { gridSquareIndex: thirdGroupGridSquareIndex, candidateIndex: firstIndexOfGroup },
                      { gridSquareIndex: thirdGroupGridSquareIndex, candidateIndex: secondIndexOfGroup },
                      { gridSquareIndex: thirdGroupGridSquareIndex, candidateIndex: thirdIndexOfGroup }
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
    }

    console.log("no naked triples")
    return { hasProgress: false }
  }
}

export default nakedTriple
