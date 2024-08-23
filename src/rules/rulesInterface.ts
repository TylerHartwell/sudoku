export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: Square[],
    toggleManualElimCandidate: (gridSquareIndex: number, candidateN: number, shouldManualElim: boolean) => void,
    handleEntry: (gridSquareIndex: number, newEntry: string) => void
  ) => (() => void) | false
}
export interface Square {
  entryValue: string
  candidates: boolean[]
  gridSquareIndex: number
}

export type RuleOutcome = "success" | "fail" | "default"
