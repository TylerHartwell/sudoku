import { Square } from "@/rules/rulesInterface"
import getRowColBox from "./getRowColBox"

const getAllSquaresByUnit = (allSquares: Square[]) => {
  const allSquaresByRow: Square[][] = Array.from({ length: 9 }, () => [])
  const allSquaresByCol: Square[][] = Array.from({ length: 9 }, () => [])
  const allSquaresByBox: Square[][] = Array.from({ length: 9 }, () => [])

  allSquares.forEach(square => {
    const { rowIndex, colIndex, boxIndex } = getRowColBox(square.gridSquareIndex)

    allSquaresByRow[rowIndex].push(square)
    allSquaresByCol[colIndex].push(square)
    allSquaresByBox[boxIndex].push(square)
  })

  const allSquaresByUnit: Square[][] = []

  for (let i = 0; i < 9; i++) {
    allSquaresByUnit.push(allSquaresByRow[i])
    allSquaresByUnit.push(allSquaresByCol[i])
    allSquaresByUnit.push(allSquaresByBox[i])
  }
  return allSquaresByUnit
}

export default getAllSquaresByUnit
