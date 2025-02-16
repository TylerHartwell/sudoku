const getRowColBox = (gridSquareIndex: number, symbolsLength: number) => {
  const rowIndex = Math.floor(gridSquareIndex / symbolsLength)
  const colIndex = gridSquareIndex % symbolsLength
  const boxRowIndex = Math.floor(rowIndex / Math.sqrt(symbolsLength))
  const boxColIndex = Math.floor(colIndex / Math.sqrt(symbolsLength))
  const boxIndex = boxRowIndex * Math.sqrt(symbolsLength) + boxColIndex

  return {
    rowIndex,
    colIndex,
    boxIndex
  }
}

export default getRowColBox
