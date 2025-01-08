import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RuleOutcome, Square } from "@/rules/rulesInterface"
import rulesArr from "@/rules/rulesArr"
import truncateAndPad from "@/utils/truncateAndPad"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import replaceNonDigitsWithZero from "@/utils/replaceNonDigitsWithZero"
import isValidChar from "@/utils/isValidChar"

function useSudokuManagement() {
  const [ruleOutcomes, setRuleOutcomes] = useState<RuleOutcome[]>(rulesArr.map(_ => "default"))
  const [puzzleStringCurrent, setPuzzleStringCurrent] = useState(() => "0".repeat(81))
  const [puzzleStringStart, setPuzzleStringStart] = useState("")
  const [boardIsSet, setBoardIsSet] = useState(false)
  const [boardIsSolved, setBoardIsSolved] = useState(false)
  const [highlightN, setHighlightN] = useState<number>(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [lastClickedHighlightN, setLastClickedHighlightN] = useState(0)
  const [manualElimCandidates, setManualElimCandidates] = useState<string[]>([])
  const [checkedRules, setCheckedRules] = useState<number[]>([])
  const [currentAutoRuleIndex, setCurrentAutoRuleIndex] = useState<number>(0)
  const [queueAutoSolve, setQueueAutoSolve] = useState<boolean>(false)
  const [goodCandidates, setGoodCandidates] = useState<string[]>([])
  const [badCandidates, setBadCandidates] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "diabolical">("easy")
  const [lastFocusedEntryIndex, setLastFocusedEntryIndex] = useState<number | null>(null)
  const padNumberClicked = useRef(false)

  const numbers = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), [])

  const handleLastFocusedEntryIndex = useCallback((entryIndex: number | null) => {
    if (entryIndex == null || (Number.isInteger(entryIndex) && entryIndex >= 0 && entryIndex < 81)) {
      setLastFocusedEntryIndex(entryIndex)
      return
    }
  }, [])

  const getCandidates = useCallback(
    (gridSquareIndex: number) => {
      const candidateArr = Array.from({ length: 9 }, (_, candidateIndex) => {
        const candidateN = candidateIndex + 1
        const candidateKey = `${gridSquareIndex}-${candidateIndex}`

        const isSquareOccupied = puzzleStringCurrent[gridSquareIndex] != "0"

        const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === candidateN.toString())

        if (isSquareOccupied || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)) {
          return false
        } else {
          return true
        }
      })
      return candidateArr
    },
    [manualElimCandidates, puzzleStringCurrent]
  )

  const allSquares: Square[] = useMemo(
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

  const getPeerSquares = useCallback(
    (gridSquareIndex: number) => {
      return allSquares.filter(square => getPeerGridSquareIndices(gridSquareIndex).includes(square.gridSquareIndex))
    },
    [allSquares]
  )

  const handleQueueAutoSolve = useCallback((beQueued: boolean) => {
    setQueueAutoSolve(beQueued)
  }, [])

  const isAlreadyInUnit = useCallback((gridSquareIndex: number, character: string, puzzleString: string) => {
    if (character == "0") return false
    return getPeerGridSquareIndices(gridSquareIndex).some(i => {
      if (i < 0 || i >= puzzleString.length) {
        console.error(`Index ${i} is out of bounds for puzzleStringCurrent with length ${puzzleString.length}`)
        return false
      }
      return puzzleString[i] == character && i != gridSquareIndex
    })
  }, [])

  const toggleManualElimCandidate = useCallback(
    (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => {
      const candidateKey = `${gridSquareIndex}-${candidateIndex}`
      const candidateN = candidateIndex + 1
      const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === candidateN.toString())
      const entryShownValue = puzzleStringCurrent[gridSquareIndex] == "0" ? "" : puzzleStringCurrent[gridSquareIndex]

      if (!isAlreadyInUnit && !entryShownValue) {
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
    },
    [puzzleStringCurrent]
  )

  const handleEntry = useCallback(
    (gridSquareIndex: number, entryChar: string) => {
      const replacementChar = isValidChar(entryChar) ? entryChar : "0"

      if (replacementChar == "0" && puzzleStringCurrent[gridSquareIndex] == "0") return

      if (replacementChar != "0" && puzzleStringCurrent[gridSquareIndex] == replacementChar) {
        setPuzzleStringCurrent(prev => {
          return prev.slice(0, gridSquareIndex) + "0" + prev.slice(gridSquareIndex + 1)
        })
        return
      }

      if (isAlreadyInUnit(gridSquareIndex, replacementChar, puzzleStringCurrent)) {
        setPuzzleStringCurrent(prev => {
          return prev.slice(0, gridSquareIndex) + "0" + prev.slice(gridSquareIndex + 1)
        })
        return
      }

      setPuzzleStringCurrent(prev => {
        return prev.slice(0, gridSquareIndex) + replacementChar + prev.slice(gridSquareIndex + 1)
      })

      if (replacementChar != "0") {
        const candidateIndex = Number(replacementChar) - 1

        getPeerSquares(gridSquareIndex).forEach(square => {
          const candidateKey = `${square.gridSquareIndex}-${candidateIndex}`

          //remove candidates matching the entryChar in peer squares of the gridSquareIndex from the manual elim candidate array
          if (manualElimCandidates.includes(candidateKey)) {
            toggleManualElimCandidate(square.gridSquareIndex, candidateIndex, false)
          }

          //remove all candidates that are in the gridSquareIndex from the manual elim candidate array
          if (square.gridSquareIndex == gridSquareIndex) {
            square.candidates.forEach((_possible, i) => {
              const candidateKey = `${gridSquareIndex}-${i}`

              if (manualElimCandidates.includes(candidateKey)) {
                toggleManualElimCandidate(gridSquareIndex, i, false)
              }
            })
          }
        })
      }
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      handleQueueAutoSolve(true)
    },
    [getPeerSquares, handleQueueAutoSolve, isAlreadyInUnit, manualElimCandidates, puzzleStringCurrent, toggleManualElimCandidate]
  )
  const tryRuleAtIndex = useCallback(
    async (ruleIndex: number, isAuto: boolean = false) => {
      const outcomeTime = isAuto ? 50 : 500
      const ruleResult = rulesArr[ruleIndex].ruleAttempt({ allSquares, toggleManualElimCandidate, handleEntry })

      const ruleOutcome: RuleOutcome = ruleResult.hasProgress ? "success" : "fail"

      handleRuleOutcome(ruleIndex, ruleOutcome)
      if (ruleResult.candidatesToMarkGood !== undefined) {
        ruleResult.candidatesToMarkGood.forEach(candidate => {
          toggleGoodCandidates(candidate.gridSquareIndex, candidate.candidateIndex, true)
        })
      }
      if (ruleResult.candidatesToMarkBad !== undefined) {
        ruleResult.candidatesToMarkBad.forEach(candidate => {
          toggleBadCandidates(candidate.gridSquareIndex, candidate.candidateIndex, true)
        })
      }

      await new Promise(resolve => setTimeout(resolve, outcomeTime))

      if (ruleResult.hasProgress && ruleResult.resolve) {
        ruleResult.resolve()
        handleQueueAutoSolve(true)
      }

      handleRuleOutcome(ruleIndex, "default")
      if (ruleResult.candidatesToMarkGood !== undefined) {
        ruleResult.candidatesToMarkGood.forEach(candidate => {
          toggleGoodCandidates(candidate.gridSquareIndex, candidate.candidateIndex, false)
        })
      }
      if (ruleResult.candidatesToMarkBad !== undefined) {
        ruleResult.candidatesToMarkBad.forEach(candidate => {
          toggleBadCandidates(candidate.gridSquareIndex, candidate.candidateIndex, false)
        })
      }

      return ruleOutcome === "success"
    },
    [allSquares, handleEntry, handleQueueAutoSolve, toggleManualElimCandidate]
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
  }, [checkedRules, currentAutoRuleIndex, handleQueueAutoSolve, tryRuleAtIndex])

  useEffect(() => {
    if (queueAutoSolve && boardIsSet && !boardIsSolved) {
      handleQueueAutoSolve(false)
      tryAutoSolves()
    }
  }, [boardIsSet, boardIsSolved, handleQueueAutoSolve, queueAutoSolve, tryAutoSolves])

  useEffect(() => {
    if (boardIsSet && checkBoardSolution(puzzleStringCurrent)) {
      setBoardIsSolved(true)
    }
  }, [boardIsSet, puzzleStringCurrent])

  const checkBoardSolution = (puzzleStringCurrent: string) => {
    return !puzzleStringCurrent.includes("0")
  }

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

  const clearManualElimCandidates = () => {
    setManualElimCandidates([])
  }

  const toggleGoodCandidates = (gridSquareIndex: number, candidateIndex: number, shouldMark?: boolean) => {
    const candidateKey = `${gridSquareIndex}-${candidateIndex}`
    setGoodCandidates(prev => {
      if (shouldMark === undefined) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev.filter(key => key !== candidateKey)
        }
      }

      if (shouldMark) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev
        }
      }

      return prev.filter(key => key !== candidateKey)
    })
  }

  const toggleBadCandidates = (gridSquareIndex: number, candidateIndex: number, shouldMark?: boolean) => {
    const candidateKey = `${gridSquareIndex}-${candidateIndex}`
    setBadCandidates(prev => {
      if (shouldMark === undefined) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev.filter(key => key !== candidateKey)
        }
      }

      if (shouldMark) {
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

  const handlePuzzleStartChange = (newValue: string) => {
    setPuzzleStringStart(newValue)
    const puzzleString = replaceNonDigitsWithZero(newValue)

    setPuzzleStringCurrent(truncateAndPad(puzzleString, 81, "0"))
  }

  const handleRuleOutcome = (ruleIndex: number, newOutcome: RuleOutcome) => {
    setRuleOutcomes(prev => {
      const updatedOutcomes = [...prev]
      updatedOutcomes[ruleIndex] = newOutcome
      return updatedOutcomes
    })
  }

  const handleDifficulty = (diff: "easy" | "medium" | "hard" | "diabolical") => {
    setDifficulty(diff)
  }

  function resetBoardData() {
    setBoardIsSolved(false)
    handleBoardSet(false)
    toggleCandidateMode(false)
    toggleShowCandidates(false)
    setCheckedRules([])
    handleHighlightNChange(0)
    handlePuzzleStartChange("")
    changeLastClickedHighlightN(0)
    clearManualElimCandidates()
    handleQueueAutoSolve(false)
  }

  return {
    ruleOutcomes,
    puzzleStringCurrent,
    handleEntry,
    puzzleStringStart,
    handlePuzzleStartChange,
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
    handleQueueAutoSolve,
    checkedRules,
    handleCheckboxChange,
    numbers,
    tryRuleAtIndex,
    resetBoardData,
    goodCandidates,
    badCandidates,
    getPeerSquares,
    boardIsSolved,
    difficulty,
    handleDifficulty,
    isAlreadyInUnit,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked
  }
}

export default useSudokuManagement
