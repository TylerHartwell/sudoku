import getRowColBox from "@/utils/getRowColBox"
import { Candidate, Rule, Square, UnitType } from "./rulesInterface"
import getAllSquaresByUnit from "@/utils/getAllSquaresByUnit"

//if all the candidates of a number in a unit are also all in a second unit, any other candidates matching that number in the second unit can be eliminated

const intersectionRemoval: Rule = {
  ruleName: "Intersection Removal",
  ruleAttempt: ({ allSquares, toggleManualElimCandidate }) => {
    const allSquaresByUnit: Square[][] = getAllSquaresByUnit(allSquares)
    const unitTypes: UnitType[] = ["row", "col", "box"]

    for (const [unitIndex, unit] of allSquaresByUnit.entries()) {
      const currentUnitType = unitTypes[unitIndex % 3]
      for (let candidateIndex = 0; candidateIndex < 9; candidateIndex++) {
        const candidateObjArr: Candidate[] = []
        let isIntersector = false

        for (const square of unit) {
          if (square.entryValue !== "0") continue

          const possible = square.candidates[candidateIndex]

          if (possible) {
            if (candidateObjArr.length >= 3) {
              isIntersector = false
              break
            }
            isIntersector = true

            candidateObjArr.push({
              gridSquareIndex: square.gridSquareIndex,
              candidateIndex,
              possible
            })
          }
        }

        if (!isIntersector || candidateObjArr.length <= 1) continue

        const { rowIndex, colIndex, boxIndex } = getRowColBox(candidateObjArr[0].gridSquareIndex)
        let peerUnitType: UnitType | undefined
        let peerUnitIndex: number | undefined

        for (const unitType of unitTypes) {
          if (currentUnitType === unitType) continue
          if (unitType === "row" && candidateObjArr.every(candidateObj => getRowColBox(candidateObj.gridSquareIndex).rowIndex === rowIndex)) {
            peerUnitIndex = rowIndex
            peerUnitType = unitType
            break
          }
          if (unitType === "col" && candidateObjArr.every(candidateObj => getRowColBox(candidateObj.gridSquareIndex).colIndex === colIndex)) {
            peerUnitIndex = colIndex
            peerUnitType = unitType
            break
          }
          if (unitType === "box" && candidateObjArr.every(candidateObj => getRowColBox(candidateObj.gridSquareIndex).boxIndex === boxIndex)) {
            peerUnitIndex = boxIndex
            peerUnitType = unitType
            break
          }
        }

        if (peerUnitType === undefined || peerUnitIndex === undefined) continue

        const offset = unitTypes.indexOf(peerUnitType)

        const peerUnit = allSquaresByUnit[peerUnitIndex * 3 + offset]
        const candidatesToMarkGood = candidateObjArr
        const candidatesToMarkBad = []
        const actions: (() => void)[] = []

        for (const square of peerUnit) {
          const gridSquareIndex = square.gridSquareIndex
          const possible = square.candidates[candidateIndex]

          const isInCurrentUnit = candidateObjArr.some(candidateObj => candidateObj.gridSquareIndex === gridSquareIndex)

          if (!isInCurrentUnit && possible) {
            console.log("intersection eliminated for candidate ", candidateIndex + 1, "at ", gridSquareIndex)
            candidatesToMarkBad.push({ gridSquareIndex, candidateIndex, possible })
            actions.push(() => toggleManualElimCandidate(gridSquareIndex, candidateIndex, true))
          }
        }

        if (actions.length > 0) {
          return {
            hasProgress: true,
            candidatesToMarkGood,
            candidatesToMarkBad,
            resolve: () => actions.forEach(action => action())
          }
        }
      }
    }
    return { hasProgress: false }
  }
}

export default intersectionRemoval
