export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: Square[],
    handleCandidateEliminate: (gridSquareIndex: number, candidateN: number) => void,
    handleEntry: (gridSquareIndex: number, newEntry: string) => void
  ) => (() => void) | false
}
export interface Square {
  entryValue: string
  candidates: boolean[]
  gridSquareIndex: number
}
