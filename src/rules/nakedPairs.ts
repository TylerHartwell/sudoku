import { Rule, Square } from "./rulesInterface"

interface Candidate {
  candidateIndex: number
  possible: boolean
  squareIndex: number
  rowIndex: number
  colIndex: number
  boxIndex: number
}

// export interface Square {
//   entryValue: string
//   candidates: boolean[]
//   gridSquareIndex: number
// }

function createCandidateObj(candidateIndex: number, possible: boolean, squareIndex: number): Candidate {
  const rowIndex = Math.floor(squareIndex / 9)
  const colIndex = squareIndex % 9
  const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)

  return {
    candidateIndex,
    possible,
    squareIndex,
    rowIndex,
    colIndex,
    boxIndex
  }
}

const nakedPairs: Rule = {
  ruleName: "Naked Pairs",
  ruleAttempt: (allSquares, toggleManualElimCandidate) => {
    const allSquaresByRow: Square[][] = Array.from({ length: 9 }, () => [])
    const allSquaresByCol: Square[][] = Array.from({ length: 9 }, () => [])
    const allSquaresByBox: Square[][] = Array.from({ length: 9 }, () => [])

    allSquares.forEach((square, index) => {
      const rowIndex = Math.floor(index / 9)
      const colIndex = index % 9
      const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)

      allSquaresByRow[rowIndex].push(square)
      allSquaresByCol[colIndex].push(square)
      allSquaresByBox[boxIndex].push(square)
    })

    const allSquaresByUnit: Square[][] = assignAllSquaresByUnit()

    function assignAllSquaresByUnit() {
      let allSquaresByUnit: Square[][] = []
      for (let i = 0; i < 9; i++) {
        allSquaresByUnit.push(allSquaresByRow[i])
        allSquaresByUnit.push(allSquaresByCol[i])
        allSquaresByUnit.push(allSquaresByBox[i])
      }
      return allSquaresByUnit
    }

    for (const [unitIndex, unit] of allSquaresByUnit.entries()) {
      let groupSize = 2
      let groupOfSize: Candidate[][] = []
      let groupOfAll = []
      for (const square of unit) {
        if (square.entryValue !== "0") continue

        const candidateObjArr: Candidate[] = []
        for (const [candidateIndex, possible] of square.candidates.entries()) {
          const candidateObj: Candidate = createCandidateObj(candidateIndex, possible, square.gridSquareIndex)
          if (candidateObj.possible) {
            candidateObjArr.push(candidateObj)
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
              const pair1SquareIndex = groupOfSize[i][0].squareIndex
              const pair2SquareIndex = groupOfSize[j][0].squareIndex

              //eliminate others from unit if present
              const unit = allSquaresByUnit[unitIndex]
              const actions = removeNakedPairCandidatesFrom(unit, pair1SquareIndex, pair2SquareIndex, firstIndexOfPair, secondIndexOfPair)

              const isUnitABox = unitIndex % 3 === 2

              if (!isUnitABox && groupOfSize[i][0].boxIndex == groupOfSize[j][0].boxIndex) {
                //eliminate others from box if present
                const unit = allSquaresByUnit[groupOfSize[i][0].boxIndex * 3 + 2]
                actions.push(...removeNakedPairCandidatesFrom(unit, pair1SquareIndex, pair2SquareIndex, firstIndexOfPair, secondIndexOfPair))
              }

              if (actions.length !== 0) {
                console.log("has elimination for pair ", firstIndexOfPair + 1, "and ", secondIndexOfPair + 1, "in unit ", unitIndex)
                return {
                  hasProgress: true,
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

    function removeNakedPairCandidatesFrom(
      unit: Square[],
      pair1SquareIndex: number,
      pair2SquareIndex: number,
      firstIndexOfPair: number,
      secondIndexOfPair: number
    ) {
      const actions: (() => void)[] = []
      for (const square of unit) {
        if (square.gridSquareIndex != pair1SquareIndex && square.gridSquareIndex != pair2SquareIndex) {
          if (square.candidates[firstIndexOfPair]) {
            actions.push(() => toggleManualElimCandidate(square.gridSquareIndex, firstIndexOfPair + 1, true))
          }
          if (square.candidates[secondIndexOfPair]) {
            actions.push(() => toggleManualElimCandidate(square.gridSquareIndex, secondIndexOfPair + 1, true))
          }
        }
      }
      return actions
    }
  }
}

export default nakedPairs
