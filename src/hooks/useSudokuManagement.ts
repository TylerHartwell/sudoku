import { useCallback, useEffect, useMemo, useState } from "react"
import { RuleOutcome } from "@/rules/rulesInterface"
import rulesArr from "@/rules/rulesArr"
import truncateAndPad from "@/utils/truncateAndPad"
import calculateAllUnits from "@/utils/calculateAllUnits"

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
  const [checkedRules, setCheckedRules] = useState<number[]>([])
  const [currentAutoRuleIndex, setCurrentAutoRuleIndex] = useState<number>(0)
  const [queueAutoSolve, setQueueAutoSolve] = useState<boolean>(false)

  const numbers = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), [])

  const allUnits = useMemo(() => {
    return calculateAllUnits(puzzleStringCurrent.split(""))
  }, [puzzleStringCurrent])

  const getCandidates = useCallback(
    (gridSquareIndex: number) => {
      const candidateArr = Array.from({ length: 9 }, (_, i) => {
        const candidateN = i + 1
        const candidateKey = `${gridSquareIndex}-${candidateN}`

        const rowIndex = Math.floor(gridSquareIndex / 9)
        const colIndex = gridSquareIndex % 9
        const boxRowIndex = Math.floor(rowIndex / 3)
        const boxColIndex = Math.floor(colIndex / 3)
        const boxIndex = boxRowIndex * 3 + boxColIndex

        if (
          allUnits.allBoxes[boxIndex].includes(candidateN.toString()) ||
          allUnits.allRows[rowIndex].includes(candidateN.toString()) ||
          allUnits.allColumns[colIndex].includes(candidateN.toString()) ||
          puzzleStringCurrent[gridSquareIndex] != "0" ||
          manualElimCandidates.includes(candidateKey)
        ) {
          return false
        } else {
          return true
        }
      })
      return candidateArr
    },
    [allUnits, manualElimCandidates, puzzleStringCurrent]
  )

  const allSquares = useMemo(
    () =>
      Array.from({ length: 81 }, (_, gridSquareIndex) => {
        return {
          entryValue: puzzleStringCurrent[gridSquareIndex],
          candidates: getCandidates(gridSquareIndex),
          gridSquareIndex
        }
      }),
    [getCandidates, puzzleStringCurrent]
  )

  const tryRuleAtIndex = useCallback(
    async (ruleIndex: number, isAuto: boolean = false) => {
      const outcomeTime = isAuto ? 0 : 500
      const ruleProgresses = rulesArr[ruleIndex].ruleAttempt(allSquares, toggleManualElimCandidate, handleEntry)

      const ruleOutcome: RuleOutcome = ruleProgresses ? "success" : "fail"

      handleRuleOutcome(ruleIndex, ruleOutcome)

      await new Promise(resolve => setTimeout(resolve, outcomeTime))

      if (ruleProgresses) {
        ruleProgresses()
        handleQueueAutoSolve(true)
      }

      handleRuleOutcome(ruleIndex, "default")

      return ruleOutcome === "success"
    },
    [allSquares]
  )

  const tryAutoSolves = useCallback(async () => {
    if (currentAutoRuleIndex >= checkedRules.length) {
      resetCurrentAutoRuleIndex()
      handleQueueAutoSolve(false)
      return
    }

    const ruleIndex = checkedRules[currentAutoRuleIndex]

    const isSuccess = await tryRuleAtIndex(ruleIndex, true)

    if (isSuccess) {
      resetCurrentAutoRuleIndex()
      handleQueueAutoSolve(true)
    } else {
      if (currentAutoRuleIndex >= checkedRules.length - 1) {
        resetCurrentAutoRuleIndex()
        handleQueueAutoSolve(false)
      } else {
        increaseCurrentAutoRuleIndex()
        handleQueueAutoSolve(true)
      }
    }
  }, [checkedRules, currentAutoRuleIndex, tryRuleAtIndex])

  useEffect(() => {
    if (queueAutoSolve && boardIsSet) {
      handleQueueAutoSolve(false)
      tryAutoSolves()
    }
  }, [queueAutoSolve, tryAutoSolves])

  const resetCurrentAutoRuleIndex = () => {
    setCurrentAutoRuleIndex(0)
  }
  const increaseCurrentAutoRuleIndex = () => {
    setCurrentAutoRuleIndex(prev => prev + 1)
  }

  const handleCheckboxChange = (ruleIndex: number) => {
    const isNewCheck = !checkedRules.includes(ruleIndex)

    setCheckedRules(prev => {
      const updatedRules = isNewCheck ? [...prev, ruleIndex] : prev.filter(n => n !== ruleIndex)
      return updatedRules.sort((a, b) => a - b)
    })

    if (isNewCheck && boardIsSet) {
      handleQueueAutoSolve(true)
    }
  }

  const handleQueueAutoSolve = (beQueued: boolean) => {
    setQueueAutoSolve(beQueued)
  }

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
    if (isSet) handleQueueAutoSolve(true)
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

  function resetBoardData() {
    handleBoardSet(false)
    toggleCandidateMode(false)
    toggleShowCandidates(false)
    handleHighlightNChange(0)
    handlePuzzleStartChange("")
    handlePuzzleSolutionChange("")
    changeLastClickedHighlightN(0)
    clearManualElimCandidates()
    handleQueueAutoSolve(false)
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
    clearManualElimCandidates,
    queueAutoSolve,
    handleQueueAutoSolve,
    checkedRules,
    handleCheckboxChange,
    currentAutoRuleIndex,
    resetCurrentAutoRuleIndex,
    increaseCurrentAutoRuleIndex,
    numbers,
    allUnits,
    getCandidates,
    allSquares,
    tryRuleAtIndex,
    tryAutoSolves,
    resetBoardData
  }
}

export default useSudokuManagement
