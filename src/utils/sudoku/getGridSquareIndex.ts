const getGridSquareIndex = (boxIndex: number, squareIndex: number, symbolsLength: number): number => {
  const rowIndex = Math.floor(boxIndex / Math.sqrt(symbolsLength)) * Math.sqrt(symbolsLength) + Math.floor(squareIndex / Math.sqrt(symbolsLength))
  const colIndex = (boxIndex % Math.sqrt(symbolsLength)) * Math.sqrt(symbolsLength) + (squareIndex % Math.sqrt(symbolsLength))
  const gridSquareIndex = rowIndex * symbolsLength + colIndex
  return gridSquareIndex
}

export default getGridSquareIndex
