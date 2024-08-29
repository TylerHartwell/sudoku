import getRowColBox from "@/utils/getRowColBox"
import { Candidate, Rule, Square } from "./rulesInterface"
import getAllSquaresByUnit from "@/utils/getAllSquaresByUnit"

const nakedPairs: Rule = {
  ruleName: "Naked Pairs",
  ruleAttempt: (allSquares, toggleManualElimCandidate, handleEntry) => {
    const allSquaresByUnit: Square[][] = getAllSquaresByUnit(allSquares)

    for (const [unitIndex, unit] of allSquaresByUnit.entries()) {
      let groupSize = 2
      let groupOfSize: Candidate[][] = []
      let groupOfAll = []
      for (const square of unit) {
        if (square.entryValue !== "0") continue

        const gridSquareIndex = square.gridSquareIndex
        const candidateObjArr: Candidate[] = []

        for (const [candidateIndex, possible] of square.candidates.entries()) {
          if (possible) {
            candidateObjArr.push({ gridSquareIndex, candidateIndex, possible })
          }
        }

        if (candidateObjArr.length > 1) {
          groupOfAll.push(candidateObjArr)
        }
      }

      groupOfSize = groupOfAll.filter(candidateObjArr => {
        return candidateObjArr.length == groupSize
      })

      if (groupOfSize.length >= groupSize) {
        for (let i = 0; i < groupOfSize.length - 1; i++) {
          for (let j = i + 1; j < groupOfSize.length; j++) {
            if (
              groupOfSize[i][0].candidateIndex == groupOfSize[j][0].candidateIndex &&
              groupOfSize[i][1].candidateIndex == groupOfSize[j][1].candidateIndex
            ) {
              const firstIndexOfPair = groupOfSize[i][0].candidateIndex
              const secondIndexOfPair = groupOfSize[i][1].candidateIndex
              const pair1GridSquareIndex = groupOfSize[i][0].gridSquareIndex
              const pair2GridSquareIndex = groupOfSize[j][0].gridSquareIndex

              //eliminate others from unit if present
              const unit = allSquaresByUnit[unitIndex]
              const candidatesToMarkBad: Candidate[] = []
              const actions: (() => void)[] = []

              const processUnit = (unit: Square[]) => {
                for (const square of unit) {
                  const gridSquareIndex = square.gridSquareIndex
                  if (gridSquareIndex !== pair1GridSquareIndex && gridSquareIndex !== pair2GridSquareIndex) {
                    if (square.candidates[firstIndexOfPair]) {
                      candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: firstIndexOfPair, possible: true })
                      actions.push(() => toggleManualElimCandidate(gridSquareIndex, firstIndexOfPair, true))
                    }
                    if (square.candidates[secondIndexOfPair]) {
                      candidatesToMarkBad.push({ gridSquareIndex, candidateIndex: secondIndexOfPair, possible: true })
                      actions.push(() => toggleManualElimCandidate(gridSquareIndex, secondIndexOfPair, true))
                    }
                  }
                }
              }
              processUnit(unit)

              const isUnitABox = unitIndex % 3 === 2

              if (
                !isUnitABox &&
                getRowColBox(groupOfSize[i][0].gridSquareIndex).boxIndex == getRowColBox(groupOfSize[j][0].gridSquareIndex).boxIndex
              ) {
                //eliminate others from box if present
                const unit = allSquaresByUnit[getRowColBox(groupOfSize[i][0].gridSquareIndex).boxIndex * 3 + 2]
                processUnit(unit)
              }

              if (actions.length !== 0) {
                console.log("has elimination for pair ", firstIndexOfPair + 1, "and ", secondIndexOfPair + 1, "in unit ", unitIndex)
                return {
                  hasProgress: true,
                  candidatesToMarkGood: [
                    { gridSquareIndex: pair1GridSquareIndex, candidateIndex: firstIndexOfPair },
                    { gridSquareIndex: pair1GridSquareIndex, candidateIndex: secondIndexOfPair },
                    { gridSquareIndex: pair2GridSquareIndex, candidateIndex: firstIndexOfPair },
                    { gridSquareIndex: pair2GridSquareIndex, candidateIndex: secondIndexOfPair }
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

    console.log("no naked pairs")
    return { hasProgress: false }

    // function removeNakedPairCandidatesFrom(
    //   unit: Square[],
    //   pair1SquareIndex: number,
    //   pair2SquareIndex: number,
    //   firstIndexOfPair: number,
    //   secondIndexOfPair: number
    // ) {
    //   const actions: (() => void)[] = []
    //   for (const square of unit) {
    //     if (square.gridSquareIndex != pair1SquareIndex && square.gridSquareIndex != pair2SquareIndex) {
    //       if (square.candidates[firstIndexOfPair]) {
    //         cand
    //         actions.push(() => toggleManualElimCandidate(square.gridSquareIndex, firstIndexOfPair, true))
    //       }
    //       if (square.candidates[secondIndexOfPair]) {
    //         actions.push(() => toggleManualElimCandidate(square.gridSquareIndex, secondIndexOfPair, true))
    //       }
    //     }
    //   }
    //   return actions
    // }
  }
}

export default nakedPairs
