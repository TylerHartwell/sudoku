export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: Square[],
    toggleManualElimCandidate: (gridSquareIndex: number, candidateN: number, shouldManualElim: boolean) => void,
    handleEntry: (gridSquareIndex: number, newEntry: string) => void
  ) => {
    hasProgress: boolean
    candidatesToMarkGood?: {
      gridSquareIndex: number
      candidateIndex: number
    }[]
    candidatesToMarkBad?: {
      gridSquareIndex: number
      candidateIndex: number
    }[]
    resolve?: () => void
  }
}
export interface Square {
  entryValue: string
  candidates: boolean[]
  gridSquareIndex: number
}

export type RuleOutcome = "success" | "fail" | "default"
