export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: Square[],
    handleCandidateEliminate: (gridSquareIndex: number, candidateN: number) => void,
    handleEntry: (gridSquareIndex: number, newEntry: string) => void
  ) => boolean
}
export interface Square {
  entryValue: string
  candidates: boolean[]
  gridSquareIndex: number
}
