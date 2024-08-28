export interface Rule {
  ruleName: string
  ruleAttempt: (
    allSquares: Square[],
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim: boolean) => void,
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
  gridSquareIndex: number
  entryValue: string
  candidates: boolean[]
}

export interface Candidate {
  gridSquareIndex: number
  candidateIndex: number
  possible: boolean
}

export type RuleOutcome = "success" | "fail" | "default"
export type UnitType = "row" | "col" | "box"
