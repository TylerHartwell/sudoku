const getRowColBox = (gridSquareIndex: number) => {
  const rowIndex = Math.floor(gridSquareIndex / 9)
  const colIndex = gridSquareIndex % 9
  const boxRowIndex = Math.floor(rowIndex / 3)
  const boxColIndex = Math.floor(colIndex / 3)
  const boxIndex = boxRowIndex * 3 + boxColIndex

  return {
    rowIndex,
    colIndex,
    boxIndex
  }
}

export default getRowColBox
