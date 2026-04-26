import getRowColBox from "./getRowColBox"

const getPeerGridSquareIndices = (
  gridSquareIndex: number,
  symbolsLength: number,
) => {
  const { rowIndex, colIndex, boxIndex } = getRowColBox(
    gridSquareIndex,
    symbolsLength,
  )

  const peerGridSquareIndices: number[] = []
  for (let i = 0; i < Math.pow(symbolsLength, 2); i++) {
    const { rowIndex: iRow, colIndex: iCol, boxIndex: iBox } = getRowColBox(i, symbolsLength)
    if (iRow === rowIndex || iCol === colIndex || iBox === boxIndex) {
      peerGridSquareIndices.push(i)
    }
  }
  return peerGridSquareIndices
}

export default getPeerGridSquareIndices
