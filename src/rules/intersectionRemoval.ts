import { Rule, Square } from "./rulesInterface"

interface Candidate {
  eliminated: boolean
  rowIndex: number
  colIndex: number
  boxIndex: number
}

// export interface Square {
//   entryValue: string
//   candidates: boolean[]
//   gridSquareIndex: number
// }

const intersectionRemoval: Rule = {
  ruleName: "Intersection Removal",
  ruleAttempt: (allSquares, handleCandidateEliminate) => {
    console.log("intersection removal attempt")

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
      for (let i = 0; i < 9; i++) {
        const candidateObjArr: Candidate[] = []

        for (const square of unit) {
          if (square.entryValue !== "0") continue

          const rowIndex = Math.floor(square.gridSquareIndex / 9)
          const colIndex = square.gridSquareIndex % 9

          const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)

          const candidateObj: Candidate = {
            eliminated: !square.candidates[i],
            rowIndex,
            colIndex,
            boxIndex
          }

          if (!candidateObj.eliminated) {
            candidateObjArr.push(candidateObj)

            if (candidateObjArr.length > 3) break
          }
        }

        if (candidateObjArr.length > 1 && candidateObjArr.length < 4) {
          const unitTypes = ["row", "col", "box"]
          let currentUnitType = unitTypes[unitIndex % 3]
          let rowIndexOfFirst = candidateObjArr[0].rowIndex
          let colIndexOfFirst = candidateObjArr[0].colIndex
          let boxIndexOfFirst = candidateObjArr[0].boxIndex
          let peerUnitType: string | undefined
          let peerUnitIndex: number | undefined
          let hasPeerUnit = false
          for (const unitType of unitTypes) {
            if (currentUnitType === unitType) continue
            if (unitType === "row" && candidateObjArr.every(candidateObj => candidateObj.rowIndex === rowIndexOfFirst)) {
              hasPeerUnit = true
              peerUnitIndex = rowIndexOfFirst
              peerUnitType = unitType
              break
            }
            if (unitType === "col" && candidateObjArr.every(candidateObj => candidateObj.colIndex === colIndexOfFirst)) {
              hasPeerUnit = true
              peerUnitIndex = colIndexOfFirst
              peerUnitType = unitType
              break
            }
            if (unitType === "box" && candidateObjArr.every(candidateObj => candidateObj.boxIndex === boxIndexOfFirst)) {
              hasPeerUnit = true
              peerUnitIndex = boxIndexOfFirst
              peerUnitType = unitType
              break
            }
          }
          if (!peerUnitType || peerUnitIndex === undefined) continue

          const offset = unitTypes.indexOf(peerUnitType)
          const peerUnit = allSquaresByUnit[peerUnitIndex * 3 + offset]
          let hasElimination = false

          for (const square of peerUnit) {
            const rowIndex = Math.floor(square.gridSquareIndex / 9)
            const colIndex = square.gridSquareIndex % 9

            const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)

            const candidateObj: Candidate = {
              eliminated: !square.candidates[i],
              rowIndex,
              colIndex,
              boxIndex
            }
            if (
              !candidateObjArr.some(
                cand => cand.rowIndex === candidateObj.rowIndex && cand.colIndex === candidateObj.colIndex && cand.boxIndex === candidateObj.boxIndex
              ) &&
              !candidateObj.eliminated
            ) {
              hasElimination = true
              handleCandidateEliminate(square.gridSquareIndex, i + 1)
            }
          }
          if (hasElimination) {
            console.log("intersection eliminated for candidate", i + 1)
            return true
          }
        }
      }
    }
    console.log("no intersection removal")
    return false
  }
}

export default intersectionRemoval
