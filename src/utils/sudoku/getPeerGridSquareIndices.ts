import { symbols } from "@/hooks/useSudokuManagement"
import getRowColBox from "./getRowColBox"

const getPeerGridSquareIndices = (gridSquareIndex: number) => {
  const { rowIndex, colIndex, boxIndex } = getRowColBox(gridSquareIndex)

  const peerGridSquareIndices: number[] = []
  for (let i = 0; i < Math.pow(symbols.length, 2); i++) {
    if (getRowColBox(i).rowIndex == rowIndex || getRowColBox(i).colIndex == colIndex || getRowColBox(i).boxIndex == boxIndex) {
      peerGridSquareIndices.push(i)
    }
  }
  return peerGridSquareIndices
}

export default getPeerGridSquareIndices
