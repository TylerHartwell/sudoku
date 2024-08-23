import { useState } from "react"
import { RuleOutcome } from "@/rules/rulesInterface"
import rulesArr from "@/rules/rulesArr"
import truncateAndPad from "@/utils/truncateAndPad"

function useSudokuManagement() {
  const [ruleOutcomes, setRuleOutcomes] = useState<RuleOutcome[]>(rulesArr.map(_ => "default"))
  const [puzzleStringCurrent, setPuzzleStringCurrent] = useState(() => "0".repeat(81))
  const [puzzleStringStart, setPuzzleStringStart] = useState("")
  const [puzzleSolution, setPuzzleSolution] = useState("")
  const [boardIsSet, setBoardIsSet] = useState(false)
  const [highlightN, setHighlightN] = useState<number>(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [lastClickedHighlightN, setLastClickedHighlightN] = useState(0)
  const [manualElimCandidates, setManualElimCandidates] = useState<string[]>([])

  const clearManualElimCandidates = () => {
    setManualElimCandidates([])
  }

  const toggleManualElimCandidate = (gridSquareIndex: number, candidateN: number, shouldManualElim?: boolean) => {
    const candidateKey = `${gridSquareIndex}-${candidateN}`
    setManualElimCandidates(prev => {
      if (shouldManualElim === undefined) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev.filter(key => key !== candidateKey)
        }
      }

      if (shouldManualElim) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev
        }
      }

      return prev.filter(key => key !== candidateKey)
    })
  }

  const changeLastClickedHighlightN = (newHighlightN: number) => {
    setLastClickedHighlightN(newHighlightN >= 0 && newHighlightN <= 9 ? newHighlightN : 0)
  }

  const toggleCandidateMode = (beCandidateMode?: boolean) => {
    setCandidateMode(prev => (beCandidateMode === undefined ? !prev : beCandidateMode))
  }
  const toggleShowCandidates = (shouldShow?: boolean) => {
    setShowCandidates(prev => (shouldShow === undefined ? !prev : shouldShow))
  }

  const handleHighlightNChange = (newHighlightN: number) => {
    setHighlightN(newHighlightN >= 0 && newHighlightN <= 9 ? newHighlightN : 0)
  }

  const handleBoardSet = (isSet: boolean) => {
    setBoardIsSet(isSet)
  }

  const handlePuzzleSolutionChange = (newValue: string) => {
    setPuzzleSolution(newValue)
  }

  const handlePuzzleStartChange = (newValue: string) => {
    setPuzzleStringStart(newValue)
    if (newValue) {
      setPuzzleStringCurrent(truncateAndPad(newValue, 81, "0"))
    } else {
      setPuzzleStringCurrent("0".repeat(81))
    }
  }

  const handleEntry = (gridSquareIndex: number, newEntry: string) => {
    setPuzzleStringCurrent(prev => {
      return prev.slice(0, gridSquareIndex) + newEntry + prev.slice(gridSquareIndex + 1)
    })
  }

  const handleRuleOutcome = (ruleIndex: number, newOutcome: RuleOutcome) => {
    setRuleOutcomes(prev => {
      const updatedOutcomes = [...prev]
      updatedOutcomes[ruleIndex] = newOutcome
      return updatedOutcomes
    })
  }

  return {
    ruleOutcomes,
    handleRuleOutcome,
    puzzleStringCurrent,
    handleEntry,
    puzzleStringStart,
    handlePuzzleStartChange,
    puzzleSolution,
    handlePuzzleSolutionChange,
    boardIsSet,
    handleBoardSet,
    highlightN,
    handleHighlightNChange,
    showCandidates,
    toggleShowCandidates,
    candidateMode,
    toggleCandidateMode,
    lastClickedHighlightN,
    changeLastClickedHighlightN,
    manualElimCandidates,
    toggleManualElimCandidate,
    clearManualElimCandidates
  }
}

export default useSudokuManagement
