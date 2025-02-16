import getRowColBox from "./getRowColBox"

const getPeerGridSquareIndices = (gridSquareIndex: number, symbolsLength: number) => {
  const { rowIndex, colIndex, boxIndex } = getRowColBox(gridSquareIndex, symbolsLength)

  const peerGridSquareIndices: number[] = []
  for (let i = 0; i < Math.pow(symbolsLength, 2); i++) {
    if (
      getRowColBox(i, symbolsLength).rowIndex == rowIndex ||
      getRowColBox(i, symbolsLength).colIndex == colIndex ||
      getRowColBox(i, symbolsLength).boxIndex == boxIndex
    ) {
      peerGridSquareIndices.push(i)
    }
  }
  return peerGridSquareIndices
}

export default getPeerGridSquareIndices
