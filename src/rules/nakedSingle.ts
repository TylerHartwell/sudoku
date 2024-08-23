import { Rule, Square } from "./rulesInterface"

const nakedSingle: Rule = {
  ruleName: "Naked Single",
  ruleAttempt: (allSquares, toggleManualElimCandidate, handleEntry) => {
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

    for (const unit of allSquaresByUnit) {
      let instanceCount = 0
      let targetGridSquareIndex: number | null = null
      for (let i = 0; i < 9; i++) {
        for (const square of unit) {
          if (instanceCount > 1) break
          if (square.entryValue != "0") continue
          if (square.candidates[i]) {
            instanceCount++
            targetGridSquareIndex = square.gridSquareIndex
          }
        }
        if (instanceCount === 1 && targetGridSquareIndex !== null) {
          const candidateNumber = i + 1
          const finalTargetGridSquareIndex = targetGridSquareIndex //narrow type to number
          console.log("naked single of ", candidateNumber, "at ", finalTargetGridSquareIndex)
          return () => handleEntry(finalTargetGridSquareIndex, candidateNumber.toString())
        }
        instanceCount = 0
      }
    }
    console.log("no naked singles")
    return false
  }
}

export default nakedSingle
