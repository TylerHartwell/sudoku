import { Square } from "@/rules/rulesInterface"
import getRowColBox from "./getRowColBox"
import { symbols } from "@/hooks/useSudokuManagement"

const getAllSquaresByUnit = (allSquares: Square[]) => {
  const allSquaresByRow: Square[][] = Array.from({ length: symbols.length }, () => [])
  const allSquaresByCol: Square[][] = Array.from({ length: symbols.length }, () => [])
  const allSquaresByBox: Square[][] = Array.from({ length: symbols.length }, () => [])

  allSquares.forEach(square => {
    const { rowIndex, colIndex, boxIndex } = getRowColBox(square.gridSquareIndex)

    allSquaresByRow[rowIndex].push(square)
    allSquaresByCol[colIndex].push(square)
    allSquaresByBox[boxIndex].push(square)
  })

  const allSquaresByUnit: Square[][] = []

  for (let i = 0; i < symbols.length; i++) {
    allSquaresByUnit.push(allSquaresByRow[i])
    allSquaresByUnit.push(allSquaresByCol[i])
    allSquaresByUnit.push(allSquaresByBox[i])
  }
  return allSquaresByUnit
}

export default getAllSquaresByUnit
