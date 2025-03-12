import { Square } from "@/rules/rulesInterface"
import getRowColBox from "./getRowColBox"

const getAllSquaresByUnit = (allSquares: Square[]) => {
  const allSquaresSqrt = Math.sqrt(allSquares.length)

  const allSquaresByRow: Square[][] = Array.from(
    { length: allSquaresSqrt },
    () => [],
  )
  const allSquaresByCol: Square[][] = Array.from(
    { length: allSquaresSqrt },
    () => [],
  )
  const allSquaresByBox: Square[][] = Array.from(
    { length: allSquaresSqrt },
    () => [],
  )

  allSquares.forEach((square) => {
    const { rowIndex, colIndex, boxIndex } = getRowColBox(
      square.gridSquareIndex,
      allSquaresSqrt,
    )

    allSquaresByRow[rowIndex].push(square)
    allSquaresByCol[colIndex].push(square)
    allSquaresByBox[boxIndex].push(square)
  })

  const allSquaresByUnit: Square[][] = []

  for (let i = 0; i < allSquaresSqrt; i++) {
    allSquaresByUnit.push(allSquaresByRow[i])
    allSquaresByUnit.push(allSquaresByCol[i])
    allSquaresByUnit.push(allSquaresByBox[i])
  }
  return allSquaresByUnit
}

export default getAllSquaresByUnit
