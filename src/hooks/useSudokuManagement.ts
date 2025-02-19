import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RuleOutcome, Square } from "@/rules/rulesInterface"
import rulesArr from "@/rules/rulesArr"
import truncateAndPad from "@/utils/truncateAndPad"
import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import replaceNonDigitsWithZero from "@/utils/replaceNonDigitsWithZero"
import isValidChar from "@/utils/isValidChar"
import getValidSymbols from "@/utils/getValidSymbols"
import countCharactersInString from "@/utils/getCountOfCharactersInStringFromArray"
import { usePersistedState } from "./usePersistedState"

// const inputSymbols = ["1", "2", "3", "4"]
const inputSymbols = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
// const inputSymbols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"]

const symbols = getValidSymbols(inputSymbols)

const symbolsLength = symbols.length

const symbolsSqrt = Math.sqrt(symbolsLength)

const difficultyLevels = ["easy", "medium", "hard", "diabolical"] as const

type Difficulty = (typeof difficultyLevels)[number] // Extracts the union type from the array

const initialStates = {
  // Puzzle-related states
  puzzleStringCurrent: "0".repeat(Math.pow(symbolsLength, 2)),
  puzzleStringStart: "",
  isBoardSet: false,
  isBoardSolved: false,

  // Rule-related states
  ruleOutcomes: rulesArr.map(_ => "default" as RuleOutcome),
  checkedRuleIndices: [] as number[],
  currentAutoRuleIndex: 0,
  shouldAutoSolve: false,

  // Candidate-related states
  shouldShowCandidates: false,
  isCandidateMode: false,
  manualElimCandidates: [] as string[],
  goodCandidates: [] as string[],
  badCandidates: [] as string[],

  // UI/Interaction states
  highlightIndex: null as number | null,
  lastClickedHighlightIndex: null as number | null,
  lastFocusedEntryIndex: null as number | null,
  sortedEntries: [] as (Element | null)[],

  // Settings
  difficulty: "easy" as Difficulty
}

function useSudokuManagement() {
  const [puzzleStringCurrent, setPuzzleStringCurrent] = usePersistedState("puzzleStringCurrent", initialStates.puzzleStringCurrent)
  const [puzzleStringStart, setPuzzleStringStart] = usePersistedState("puzzleStringStart", initialStates.puzzleStringStart)
  const [isBoardSet, setIsBoardSet] = usePersistedState("isBoardSet", initialStates.isBoardSet)
  const [isBoardSolved, setIsBoardSolved] = usePersistedState("isBoardSolved", initialStates.isBoardSolved)

  const [ruleOutcomes, setRuleOutcomes] = usePersistedState("ruleOutcomes", initialStates.ruleOutcomes)
  const [checkedRuleIndices, setCheckedRuleIndices] = usePersistedState("checkedRuleIndices", initialStates.checkedRuleIndices)
  const [currentAutoRuleIndex, setCurrentAutoRuleIndex] = usePersistedState("currentAutoRuleIndex", initialStates.currentAutoRuleIndex)
  const [shouldAutoSolve, setShouldAutoSolve] = usePersistedState("shouldAutoSolve", initialStates.shouldAutoSolve)

  const [shouldShowCandidates, setShouldShowCandidates] = usePersistedState("shouldShowCandidates", initialStates.shouldShowCandidates)
  const [isCandidateMode, setIsCandidateMode] = usePersistedState("isCandidateMode", initialStates.isCandidateMode)
  const [manualElimCandidates, setManualElimCandidates] = usePersistedState("manualElimCandidates", initialStates.manualElimCandidates)
  const [goodCandidates, setGoodCandidates] = usePersistedState("goodCandidates", initialStates.goodCandidates)
  const [badCandidates, setBadCandidates] = usePersistedState("badCandidates", initialStates.badCandidates)

  const [highlightIndex, setHighlightIndex] = usePersistedState("highlightIndex", initialStates.highlightIndex)
  const [lastClickedHighlightIndex, setLastClickedHighlightIndex] = usePersistedState(
    "lastClickedHighlightIndex",
    initialStates.lastClickedHighlightIndex
  )
  const [lastFocusedEntryIndex, setLastFocusedEntryIndex] = usePersistedState("lastFocusedEntryIndex", initialStates.lastFocusedEntryIndex)
  const [sortedEntries, setSortedEntries] = useState(initialStates.sortedEntries)

  const [difficulty, setDifficulty] = usePersistedState("difficulty", initialStates.difficulty)

  const padNumberClicked = useRef(false)

  const charCounts = useMemo(() => countCharactersInString(puzzleStringCurrent, symbols), [puzzleStringCurrent])

  useEffect(() => {
    const entryDivs = Array.from(document.querySelectorAll("[data-entry]"))

    const filteredDivs = entryDivs.filter(div => (div as HTMLElement).tabIndex !== -1)

    const sortedDivs = filteredDivs.sort((a, b) => {
      const indexA = parseInt(a.getAttribute("data-grid-square-index") || "0", 10)
      const indexB = parseInt(b.getAttribute("data-grid-square-index") || "0", 10)
      return indexA - indexB
    })

    handleSortedEntries(sortedDivs)
  }, [isBoardSet])

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!target.matches(".entry") && !target.matches(".pad-number")) {
        padNumberClicked.current = false
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [])

  const getCandidates = useCallback(
    (gridSquareIndex: number) => {
      const candidateArr = Array.from({ length: symbolsLength }, (_, candidateIndex) => {
        const candidateKey = `${gridSquareIndex}-${candidateIndex}`

        const isSquareOccupied = puzzleStringCurrent[gridSquareIndex] != "0"

        const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex, symbolsLength).some(i => puzzleStringCurrent[i] === symbols[candidateIndex])

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
      Array.from({ length: Math.pow(symbolsLength, 2) }, (_, gridSquareIndex) => {
        return {
          entryValue: puzzleStringCurrent[gridSquareIndex],
          candidates: getCandidates(gridSquareIndex),
          gridSquareIndex: gridSquareIndex
        }
      }),
    [getCandidates, puzzleStringCurrent]
  )

  const getPeerSquares = useCallback(
    (gridSquareIndex: number) => {
      return allSquares.filter(square => getPeerGridSquareIndices(gridSquareIndex, symbolsLength).includes(square.gridSquareIndex))
    },
    [allSquares]
  )

  const handleQueueAutoSolve = useCallback((beQueued: boolean) => {
    setShouldAutoSolve(beQueued)
  }, [])

  const isAlreadyInUnit = useCallback((gridSquareIndex: number, character: string, puzzleString: string) => {
    if (character == "0" || character == "") return false
    return getPeerGridSquareIndices(gridSquareIndex, symbolsLength).some(i => {
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
      const isCandidateInPeerEntry = isAlreadyInUnit(gridSquareIndex, symbols[candidateIndex], puzzleStringCurrent)
      const entryShownValue = puzzleStringCurrent[gridSquareIndex] == "0" ? "" : puzzleStringCurrent[gridSquareIndex]

      if (!isCandidateInPeerEntry && !entryShownValue) {
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
    [isAlreadyInUnit, puzzleStringCurrent]
  )

  const replacePuzzleStringCurrentAtWith = (gridSquareIndex: number, replacement: string) => {
    setPuzzleStringCurrent(prev => {
      return prev.slice(0, gridSquareIndex) + replacement + prev.slice(gridSquareIndex + 1)
    })
  }

  const checkForAnySudokuConflict = useCallback(() => {
    for (let i = 0; i < puzzleStringCurrent.length; i++) {
      const character = puzzleStringCurrent[i]
      if (character !== "0") {
        if (isAlreadyInUnit(i, character, puzzleStringCurrent)) {
          return true
        }
      }
    }
    return false
  }, [isAlreadyInUnit, puzzleStringCurrent])

  const handleEntry = useCallback(
    (gridSquareIndex: number, entryChar: string) => {
      const replacementChar = isValidChar(entryChar, symbols) ? entryChar : "0"

      if (replacementChar == "0") {
        if (puzzleStringCurrent[gridSquareIndex] == "0") return
        replacePuzzleStringCurrentAtWith(gridSquareIndex, replacementChar)

        return
      }

      replacePuzzleStringCurrentAtWith(gridSquareIndex, replacementChar)
      const candidateIndex = symbols.indexOf(replacementChar)

      getPeerSquares(gridSquareIndex).forEach(square => {
        const candidateKey = `${square.gridSquareIndex}-${candidateIndex}`

        //remove all candidates that are in the gridSquareIndex from the manual elim candidate array
        if (square.gridSquareIndex == gridSquareIndex) {
          square.candidates.forEach((_possible, i) => {
            const candidateKey = `${gridSquareIndex}-${i}`

            if (manualElimCandidates.includes(candidateKey)) {
              toggleManualElimCandidate(gridSquareIndex, i, false)
            }
          })
        } else {
          //remove candidates matching the replacementChar in peer squares of the gridSquareIndex from the manual elim candidate array
          if (manualElimCandidates.includes(candidateKey)) {
            toggleManualElimCandidate(square.gridSquareIndex, candidateIndex, false)
          }
        }
      })
    },
    [getPeerSquares, manualElimCandidates, puzzleStringCurrent, toggleManualElimCandidate]
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
    if (currentAutoRuleIndex >= checkedRuleIndices.length) {
      resetCurrentAutoRuleIndex()
      handleQueueAutoSolve(false)
      return
    }

    const ruleIndex = checkedRuleIndices[currentAutoRuleIndex]

    const isSuccess = await tryRuleAtIndex(ruleIndex, true)

    if (isSuccess) {
      resetCurrentAutoRuleIndex()
      handleQueueAutoSolve(true)
    } else {
      if (currentAutoRuleIndex >= checkedRuleIndices.length - 1) {
        resetCurrentAutoRuleIndex()
        handleQueueAutoSolve(false)
      } else {
        increaseCurrentAutoRuleIndex()
        handleQueueAutoSolve(true)
      }
    }
  }, [checkedRuleIndices, currentAutoRuleIndex, handleQueueAutoSolve, tryRuleAtIndex])

  useEffect(() => {
    if (shouldAutoSolve && isBoardSet && !isBoardSolved && !checkForAnySudokuConflict()) {
      handleQueueAutoSolve(false)
      tryAutoSolves()
    }
  }, [isBoardSet, isBoardSolved, checkForAnySudokuConflict, handleQueueAutoSolve, shouldAutoSolve, tryAutoSolves])

  useEffect(() => {
    if (isBoardSet && checkBoardSolution(puzzleStringCurrent)) {
      setIsBoardSolved(true)
    }
  }, [isBoardSet, puzzleStringCurrent])

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
    const isNewCheck = !checkedRuleIndices.includes(ruleIndex)

    setCheckedRuleIndices(prev => {
      const updatedRules = isNewCheck ? [...prev, ruleIndex] : prev.filter(n => n !== ruleIndex)
      return updatedRules.sort((a, b) => a - b)
    })

    if (isNewCheck && isBoardSet) {
      handleQueueAutoSolve(true)
    }
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

  const toggleCandidateMode = (beCandidateMode?: boolean) => {
    setIsCandidateMode(prev => (beCandidateMode === undefined ? !prev : beCandidateMode))
  }
  const toggleShowCandidates = (shouldShow?: boolean) => {
    setShouldShowCandidates(prev => (shouldShow === undefined ? !prev : shouldShow))
  }

  const handleIsBoardSet = (isSet: boolean) => {
    if (isSet) {
      if (checkForAnySudokuConflict()) {
        alert("There is a sudoku conflict")
        return
      }

      handleQueueAutoSolve(true)
    }
    setIsBoardSet(isSet)
  }

  const toggleCandidateQueueSolveOnElim = (gridSquareIndex: number, candidateIndex: number) => {
    toggleManualElimCandidate(gridSquareIndex, candidateIndex)
    const candidateKey = `${gridSquareIndex}-${candidateIndex}`
    if (!manualElimCandidates.includes(candidateKey)) {
      handleQueueAutoSolve(true)
    }
  }

  const formatStringToPuzzleString = (value: string) => {
    const zeroReplaced = replaceNonDigitsWithZero(value)
    return truncateAndPad(zeroReplaced, Math.pow(symbolsLength, 2), "0", symbols)
  }

  const handlePuzzleStartChange = (newValue: string) => {
    setPuzzleStringStart(newValue)

    setPuzzleStringCurrent(formatStringToPuzzleString(newValue))
  }

  const handleRuleOutcome = (ruleIndex: number, newOutcome: RuleOutcome) => {
    setRuleOutcomes(prev => {
      const updatedOutcomes = [...prev]
      updatedOutcomes[ruleIndex] = newOutcome
      return updatedOutcomes
    })
  }

  /////

  const handleHighlightIndex = (newValue: number | null) => {
    setHighlightIndex(newValue == null || newValue < 0 || newValue >= symbolsLength ? null : newValue)
  }

  const handleLastClickedHighlightIndex = (newValue: number | null) => {
    setLastClickedHighlightIndex(newValue == null || newValue < 0 || newValue >= symbolsLength ? null : newValue)
  }

  const handleLastFocusedEntryIndex = useCallback((newValue: number | null) => {
    if (newValue == null || (Number.isInteger(newValue) && newValue >= 0 && newValue < Math.pow(symbolsLength, 2))) {
      setLastFocusedEntryIndex(newValue)
    }
  }, [])

  const handleSortedEntries = (newValue: typeof sortedEntries) => {
    setSortedEntries(newValue)
  }

  const handleDifficulty = (newValue: Difficulty) => {
    setDifficulty(newValue)
  }

  const restartPuzzle = () => {
    setPuzzleStringCurrent(formatStringToPuzzleString(puzzleStringStart))
    setIsBoardSolved(initialStates.isBoardSolved)

    setRuleOutcomes(initialStates.ruleOutcomes)
    setCurrentAutoRuleIndex(initialStates.currentAutoRuleIndex)
    setShouldAutoSolve(initialStates.shouldAutoSolve)

    setManualElimCandidates(initialStates.manualElimCandidates)
    setGoodCandidates(initialStates.goodCandidates)
    setBadCandidates(initialStates.badCandidates)

    handleHighlightIndex(initialStates.highlightIndex)
    handleLastClickedHighlightIndex(initialStates.lastClickedHighlightIndex)
    handleLastFocusedEntryIndex(initialStates.lastFocusedEntryIndex)

    padNumberClicked.current = false
  }

  const resetBoardData = useCallback(() => {
    setPuzzleStringCurrent(initialStates.puzzleStringCurrent)
    setPuzzleStringStart(initialStates.puzzleStringStart)
    handleIsBoardSet(initialStates.isBoardSet)
    setIsBoardSolved(initialStates.isBoardSolved)

    setRuleOutcomes(initialStates.ruleOutcomes)
    setCheckedRuleIndices(initialStates.checkedRuleIndices)
    setCurrentAutoRuleIndex(initialStates.currentAutoRuleIndex)
    setShouldAutoSolve(initialStates.shouldAutoSolve)

    setShouldShowCandidates(initialStates.shouldShowCandidates)
    setIsCandidateMode(initialStates.isCandidateMode)
    setManualElimCandidates(initialStates.manualElimCandidates)
    setGoodCandidates(initialStates.goodCandidates)
    setBadCandidates(initialStates.badCandidates)

    handleHighlightIndex(initialStates.highlightIndex)
    handleLastClickedHighlightIndex(initialStates.lastClickedHighlightIndex)
    handleLastFocusedEntryIndex(initialStates.lastFocusedEntryIndex)
    handleSortedEntries(initialStates.sortedEntries)

    handleDifficulty(initialStates.difficulty)

    padNumberClicked.current = false

    localStorage.clear()
  }, [])

  return {
    ruleOutcomes,
    puzzleStringCurrent,
    handleEntry,
    puzzleStringStart,
    handlePuzzleStartChange,
    isBoardSet,
    handleIsBoardSet,
    highlightIndex,
    handleHighlightIndex,
    shouldShowCandidates,
    toggleShowCandidates,
    isCandidateMode,
    toggleCandidateMode,
    lastClickedHighlightIndex,
    handleLastClickedHighlightIndex,
    manualElimCandidates,
    toggleManualElimCandidate,
    handleQueueAutoSolve,
    checkedRuleIndices,
    handleCheckboxChange,
    tryRuleAtIndex,
    resetBoardData,
    goodCandidates,
    badCandidates,
    getPeerSquares,
    isBoardSolved,
    difficulty,
    handleDifficulty,
    isAlreadyInUnit,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked,
    charCounts,
    restartPuzzle,
    toggleCandidateQueueSolveOnElim,
    sortedEntries
  }
}

export default useSudokuManagement
export { symbols, symbolsLength, symbolsSqrt, difficultyLevels }
export type { Difficulty }
