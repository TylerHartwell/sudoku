import { ReactNode } from "react"
import Box from "./Box"

const Board = () => {
  // const boardData = {
  //   isSet: false,
  //   isCandidateMode: false,
  //   allBoxes: [],
  //   allSquares: [],
  //   allEntries: [],
  //   allCandidates: []
  // }

  // function createBoardHTML(boardData: any) {
  //   boardData.allBoxes = createBoxes()
  // }

  // function resetBoardData() {
  //   boardData.isSet = false
  //   boardData.isCandidateMode = false
  //   boardData.allSquares = getAllSquares()
  //   boardData.allEntries = getAllEntries()
  //   boardData.allCandidates = getAllCandidates()
  // }

  // function createBoxes() {
  //   let allBoxes = []
  //   for (let boxId = 1; boxId <= 9; boxId++) {
  //     const box = {
  //       boxId: boxId,
  //       boxSquares: createSquares(boxId)
  //     }
  //     allBoxes.push(box)
  //   }
  //   return allBoxes
  // }

  // function createSquares(boxId: number) {
  //   let boxSquares = []
  //   for (let squareN = 1; squareN <= 9; squareN++) {
  //     const rowN = Math.round(
  //       Math.floor((boxId - 1) / 3) * 3 + Math.floor((squareN - 1) / 3) + 1
  //     )
  //     const colN = Math.round(((boxId - 1) % 3) * 3 + ((squareN - 1) % 3) + 1)
  //     const squareId = (rowN - 1) * 9 + colN
  //     const square = {
  //       rowN: rowN,
  //       colN: colN,
  //       boxId: boxId,
  //       squareId: squareId,
  //       entry: {
  //         squareId: squareId,
  //         shownValue: "",
  //         isLocked: false
  //       },
  //       squareCandidates: createCandidates(rowN, colN, boxId, squareId)
  //     }
  //     boxSquares.push(square)
  //   }
  //   return boxSquares
  // }

  // function createCandidates(rowN: number, colN: number, boxN: number, squareId: number) {
  //   let squareCandidates = []
  //   for (let c = 1; c <= 9; c++) {
  //     const candidate = {
  //       rowN: rowN,
  //       colN: colN,
  //       boxN: boxN,
  //       squareId: squareId,
  //       number: c.toString(),
  //       eliminated: false
  //     }
  //     squareCandidates.push(candidate)
  //   }
  //   return squareCandidates
  // }

  return (
    <section className="board">
      {Array.from({ length: 9 }).map((_, index) => (
        <Box key={index} boxId={index + 1} />
      ))}
    </section>
  )
}

export default Board
