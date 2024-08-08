const newZeroMatrix = () => {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

const calculateAllUnits = (puzzleString: string) => {
  const boxesMatrix = newZeroMatrix()
  const rowsMatrix = newZeroMatrix()
  const columnsMatrix = newZeroMatrix()

  for (let index = 0; index < 81; index++) {
    const rowIndex = Math.floor(index / 9)
    const colIndex = index % 9
    const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)
    const value = puzzleString[index]

    boxesMatrix[boxIndex][(rowIndex % 3) * 3 + (colIndex % 3)] = value
    rowsMatrix[rowIndex][colIndex] = value
    columnsMatrix[colIndex][rowIndex] = value
  }

  return {
    allBoxes: boxesMatrix,
    allRows: rowsMatrix,
    allColumns: columnsMatrix
  }
}

export default calculateAllUnits
