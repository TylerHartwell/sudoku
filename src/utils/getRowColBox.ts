import { symbols } from "@/hooks/useSudokuManagement"

const getRowColBox = (gridSquareIndex: number) => {
  const rowIndex = Math.floor(gridSquareIndex / symbols.length)
  const colIndex = gridSquareIndex % symbols.length
  const boxRowIndex = Math.floor(rowIndex / Math.sqrt(symbols.length))
  const boxColIndex = Math.floor(colIndex / Math.sqrt(symbols.length))
  const boxIndex = boxRowIndex * Math.sqrt(symbols.length) + boxColIndex

  return {
    rowIndex,
    colIndex,
    boxIndex
  }
}

export default getRowColBox
