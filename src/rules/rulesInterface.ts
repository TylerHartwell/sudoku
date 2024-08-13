export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: { entryValue: string; candidates: boolean[] }[],
    handleCandidateEliminate: (gridSquareIndex: number, candidateN: number) => void,
    handleEntry: (gridSquareIndex: number, newEntry: string) => void
  ) => boolean
}
