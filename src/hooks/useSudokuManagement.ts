import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RuleOutcome, Square } from "@/rules/rulesInterface"
import rulesArr from "@/rules/rulesArr"
import truncateAndPad from "@/utils/truncateAndPad"
import getPeerGridSquareIndices from "@/utils/sudoku/getPeerGridSquareIndices"
import replaceNonDigitsWithZero from "@/utils/replaceNonDigitsWithZero"
import isValidChar from "@/utils/isValidChar"
import getValidSymbols from "@/utils/getValidSymbols"
import getCountOfCharactersInStringFromArray from "@/utils/getCountOfCharactersInStringFromArray"
import { usePersistedState } from "./usePersistedState"
import createStateHandler from "@/utils/createStateHandler"
import { clearLocalStoragePreserve } from "@/utils/localStorage"

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
  ruleOutcomes: rulesArr.map((_) => "default" as RuleOutcome),
  checkedRuleIndices: [],
  currentAutoRuleIndex: 0,
  shouldAutoSolve: false,

  // Candidate-related states
  shouldShowCandidates: false,
  isCandidateMode: false,
  manualElimCandidates: [],
  goodCandidates: [],
  badCandidates: [],

  // UI/Interaction states
  highlightIndex: null,
  lastClickedHighlightIndex: null,
  lastFocusedEntryIndex: null,
  sortedEntries: [],

  // Settings
  difficulty: "easy" as Difficulty,
}

function useSudokuManagement() {
  const [
    puzzleStringCurrent,
    setPuzzleStringCurrent,
    isLoadingPuzzleStringCurrent,
  ] = usePersistedState<string>(
    "puzzleStringCurrent",
    initialStates.puzzleStringCurrent,
  )
  const handlePuzzleStringCurrent = createStateHandler(setPuzzleStringCurrent, {
    sideEffect: (newValue) => {
      if (newValue === undefined) return
      handleIsBoardSolved(isBoardSet && checkBoardFilled(newValue))
    },
  })
  const replacePuzzleStringCurrentAtWith = (
    gridSquareIndex: number,
    replacement: string,
  ) => {
    const newValue =
      puzzleStringCurrent.slice(0, gridSquareIndex) +
      replacement +
      puzzleStringCurrent.slice(gridSquareIndex + 1)

    handlePuzzleStringCurrent(newValue)
  }

  const [puzzleStringStart, setPuzzleStringStart, isLoadingPuzzleStringStart] =
    usePersistedState<string>(
      "puzzleStringStart",
      initialStates.puzzleStringStart,
    )
  const handlePuzzleStringStart = createStateHandler(setPuzzleStringStart, {
    sideEffect: (newValue) => {
      if (newValue === undefined) return
      handlePuzzleStringCurrent(formatStringToPuzzleString(newValue))
    },
  })

  const [isBoardSet, setIsBoardSet, isLoadingIsBoardSet] =
    usePersistedState<boolean>("isBoardSet", initialStates.isBoardSet)
  const handleIsBoardSet = createStateHandler(setIsBoardSet, {
    validator: (newValue) => {
      if (newValue && checkForAnySudokuConflict()) {
        alert("There is a sudoku conflict")
        return false
      } else return true
    },
    sideEffect: (newValue) => {
      if (newValue) {
        handleShouldAutoSolve(true)
      }
    },
  })

  const [isBoardSolved, setIsBoardSolved, isLoadingIsBoardSolved] =
    usePersistedState<boolean>("isBoardSolved", initialStates.isBoardSolved)
  const handleIsBoardSolved = createStateHandler(setIsBoardSolved)

  const [ruleOutcomes, setRuleOutcomes, isLoadingRuleOutcomes] =
    usePersistedState<RuleOutcome[]>("ruleOutcomes", initialStates.ruleOutcomes)
  const handleRuleOutcomes = createStateHandler(setRuleOutcomes)
  const handleRuleOutcomeAtIndex = (
    ruleIndex: number,
    newOutcome: RuleOutcome,
  ) => {
    handleRuleOutcomes((prev) => {
      const updatedOutcomes = [...prev]
      updatedOutcomes[ruleIndex] = newOutcome
      return updatedOutcomes
    })
  }

  const [
    checkedRuleIndices,
    setCheckedRuleIndices,
    isLoadingCheckedRuleIndices,
  ] = usePersistedState<number[]>(
    "checkedRuleIndices",
    initialStates.checkedRuleIndices,
  )
  const handleCheckedRuleIndices = createStateHandler(setCheckedRuleIndices)

  const [
    currentAutoRuleIndex,
    setCurrentAutoRuleIndex,
    isLoadingCurrentAutoRuleIndex,
  ] = usePersistedState<number>(
    "currentAutoRuleIndex",
    initialStates.currentAutoRuleIndex,
  )
  const handleCurrentAutoRuleIndex = createStateHandler(setCurrentAutoRuleIndex)
  const resetCurrentAutoRuleIndex = () => {
    handleCurrentAutoRuleIndex(0)
  }
  const increaseCurrentAutoRuleIndex = () => {
    handleCurrentAutoRuleIndex((prev) => prev + 1)
  }

  const [shouldAutoSolve, setShouldAutoSolve, isLoadingShouldAutoSolve] =
    usePersistedState<boolean>("shouldAutoSolve", initialStates.shouldAutoSolve)
  const handleShouldAutoSolve = createStateHandler(setShouldAutoSolve)

  const [
    shouldShowCandidates,
    setShouldShowCandidates,
    isLoadingShouldShowCandidates,
  ] = usePersistedState<boolean>(
    "shouldShowCandidates",
    initialStates.shouldShowCandidates,
  )
  const handleShouldShowCandidates = createStateHandler(setShouldShowCandidates)
  const toggleShouldShowCandidates = (shouldShow?: boolean) => {
    handleShouldShowCandidates((prev) =>
      shouldShow === undefined ? !prev : shouldShow,
    )
  }

  const [isCandidateMode, setIsCandidateMode, isLoadingIsCandidateMode] =
    usePersistedState<boolean>("isCandidateMode", initialStates.isCandidateMode)
  const handleIsCandidateMode = createStateHandler(setIsCandidateMode)
  const toggleCandidateMode = (beCandidateMode?: boolean) => {
    handleIsCandidateMode((prev) =>
      beCandidateMode === undefined ? !prev : beCandidateMode,
    )
  }

  const [
    manualElimCandidates,
    setManualElimCandidates,
    isLoadingManualElimCandidates,
  ] = usePersistedState<string[]>(
    "manualElimCandidates",
    initialStates.manualElimCandidates,
  )
  const handleManualElimCandidates = createStateHandler(setManualElimCandidates)
  const toggleManualElimCandidate = useCallback(
    (
      gridSquareIndex: number,
      candidateIndex: number,
      shouldManualElim?: boolean,
    ) => {
      const candidateKey = `${gridSquareIndex}-${candidateIndex}`
      const isCandidateInPeerEntry = isAlreadyInUnit(
        gridSquareIndex,
        symbols[candidateIndex],
        puzzleStringCurrent,
      )
      const entryShownValue =
        puzzleStringCurrent[gridSquareIndex] == "0"
          ? ""
          : puzzleStringCurrent[gridSquareIndex]

      if (!isCandidateInPeerEntry && !entryShownValue) {
        handleManualElimCandidates((prev) => {
          if (shouldManualElim === undefined) {
            if (!prev.includes(candidateKey)) {
              return [...prev, candidateKey]
            } else {
              return prev.filter((key) => key !== candidateKey)
            }
          }

          if (shouldManualElim) {
            if (!prev.includes(candidateKey)) {
              return [...prev, candidateKey]
            } else {
              return prev
            }
          }

          return prev.filter((key) => key !== candidateKey)
        })
      }
    },
    [isAlreadyInUnit, puzzleStringCurrent],
  )

  const [goodCandidates, setGoodCandidates, isLoadingGoodCandidates] =
    usePersistedState<string[]>("goodCandidates", initialStates.goodCandidates)
  const handleGoodCandidates = createStateHandler(setGoodCandidates)
  const toggleGoodCandidates = (
    gridSquareIndex: number,
    candidateIndex: number,
    shouldMark?: boolean,
  ) => {
    const candidateKey = `${gridSquareIndex}-${candidateIndex}`
    handleGoodCandidates((prev) => {
      if (shouldMark === undefined) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev.filter((key) => key !== candidateKey)
        }
      }

      if (shouldMark) {
        if (!prev.includes(candidateKey)) {
          return [...prev, candidateKey]
        } else {
          return prev
        }
      }

      return prev.filter((key) => key !== candidateKey)
    })
  }

  const [badCandidates, setBadCandidates, isLoadingBadCandidates] =
    usePersistedState<string[]>("badCandidates", initialStates.badCandidates)
  const handleBadCandidates = createStateHandler(setBadCandidates)
  const toggleBadCandidates = (
    gridSquareIndex: number,
    candidateIndex: number,
    shouldMark?: boolean,
  ) => {
    const candidateKey = `${gridSquareIndex}-${candidateIndex}`
    handleBadCandidates((prev) => {
      if (shouldMark === undefined) {
        return prev.includes(candidateKey)
          ? prev.filter((key) => key !== candidateKey)
          : [...prev, candidateKey]
      }

      return shouldMark
        ? prev.includes(candidateKey)
          ? prev
          : [...prev, candidateKey]
        : prev.filter((key) => key !== candidateKey)
    })
  }

  const [highlightIndex, setHighlightIndex, isLoadingHighlightIndex] =
    usePersistedState<number | null>(
      "highlightIndex",
      initialStates.highlightIndex,
    )
  const handleHighlightIndex = createStateHandler(setHighlightIndex, {
    modifier: getValidIndexOrNull,
  })

  const [
    lastClickedHighlightIndex,
    setLastClickedHighlightIndex,
    isLoadingLastClickedHighlightIndex,
  ] = usePersistedState<number | null>(
    "lastClickedHighlightIndex",
    initialStates.lastClickedHighlightIndex,
  )
  const handleLastClickedHighlightIndex = createStateHandler(
    setLastClickedHighlightIndex,
    {
      modifier: getValidIndexOrNull,
    },
  )

  const [
    lastFocusedEntryIndex,
    setLastFocusedEntryIndex,
    isLoadingLastFocusedEntryIndex,
  ] = usePersistedState<number | null>(
    "lastFocusedEntryIndex",
    initialStates.lastFocusedEntryIndex,
  )
  const handleLastFocusedEntryIndex = createStateHandler(
    setLastFocusedEntryIndex,
    {
      validator: (newValue) => {
        return (
          newValue == null ||
          (Number.isInteger(newValue) &&
            newValue >= 0 &&
            newValue < Math.pow(symbolsLength, 2))
        )
      },
    },
  )

  const [sortedEntries, setSortedEntries] = useState<(Element | null)[]>(
    initialStates.sortedEntries,
  )
  const handleSortedEntries = createStateHandler(setSortedEntries)

  const [difficulty, setDifficulty, isLoadingDifficulty] =
    usePersistedState<Difficulty>("difficulty", initialStates.difficulty)
  const handleDifficulty = createStateHandler(setDifficulty)

  const entryDivRefs = useRef<(HTMLDivElement | null)[]>([])

  const padNumberClicked = useRef(false)

  const charCounts = useMemo(
    () => getCountOfCharactersInStringFromArray(puzzleStringCurrent, symbols),
    [puzzleStringCurrent],
  )

  const allSquares: Square[] = useMemo(
    () =>
      Array.from(
        { length: Math.pow(symbolsLength, 2) },
        (_, gridSquareIndex) => {
          return {
            entryValue: puzzleStringCurrent[gridSquareIndex],
            candidates: getCandidates(gridSquareIndex),
            gridSquareIndex: gridSquareIndex,
          }
        },
      ),
    [getCandidates, puzzleStringCurrent],
  )

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

      getPeerSquares(gridSquareIndex).forEach((square) => {
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
            toggleManualElimCandidate(
              square.gridSquareIndex,
              candidateIndex,
              false,
            )
          }
        }
      })
    },
    [
      getPeerSquares,
      manualElimCandidates,
      puzzleStringCurrent,
      toggleManualElimCandidate,
    ],
  )

  const tryRuleAtIndex = useCallback(
    async (ruleIndex: number, isAuto: boolean = false) => {
      if (isBoardSolved) {
        handleRuleOutcomeAtIndex(ruleIndex, "default")
        return "default" as RuleOutcome
      }
      const outcomeTime = isAuto ? 50 : 500
      const ruleResult = rulesArr[ruleIndex].ruleAttempt({
        allSquares,
        toggleManualElimCandidate,
        handleEntry,
      })

      const ruleOutcome: RuleOutcome = ruleResult.hasProgress
        ? "success"
        : "fail"

      handleRuleOutcomeAtIndex(ruleIndex, ruleOutcome)
      if (ruleResult.candidatesToMarkGood !== undefined) {
        ruleResult.candidatesToMarkGood.forEach((candidate) => {
          toggleGoodCandidates(
            candidate.gridSquareIndex,
            candidate.candidateIndex,
            true,
          )
        })
      }
      if (ruleResult.candidatesToMarkBad !== undefined) {
        ruleResult.candidatesToMarkBad.forEach((candidate) => {
          toggleBadCandidates(
            candidate.gridSquareIndex,
            candidate.candidateIndex,
            true,
          )
        })
      }

      await new Promise((resolve) => setTimeout(resolve, outcomeTime))

      if (ruleResult.hasProgress && ruleResult.resolve) {
        ruleResult.resolve()
        handleShouldAutoSolve(true)
      }

      handleRuleOutcomeAtIndex(ruleIndex, "default")
      if (ruleResult.candidatesToMarkGood !== undefined) {
        ruleResult.candidatesToMarkGood.forEach((candidate) => {
          toggleGoodCandidates(
            candidate.gridSquareIndex,
            candidate.candidateIndex,
            false,
          )
        })
      }
      if (ruleResult.candidatesToMarkBad !== undefined) {
        ruleResult.candidatesToMarkBad.forEach((candidate) => {
          toggleBadCandidates(
            candidate.gridSquareIndex,
            candidate.candidateIndex,
            false,
          )
        })
      }

      return ruleOutcome
    },
    [allSquares, handleEntry, handleShouldAutoSolve, toggleManualElimCandidate],
  )

  const tryAutoSolves = useCallback(async () => {
    if (currentAutoRuleIndex >= checkedRuleIndices.length || isBoardSolved) {
      resetCurrentAutoRuleIndex()
      handleShouldAutoSolve(false)
      return
    }

    const ruleIndex = checkedRuleIndices[currentAutoRuleIndex]

    const isSuccess = (await tryRuleAtIndex(ruleIndex, true)) === "success"

    if (isSuccess) {
      resetCurrentAutoRuleIndex()
      handleShouldAutoSolve(true)
    } else {
      if (currentAutoRuleIndex >= checkedRuleIndices.length - 1) {
        resetCurrentAutoRuleIndex()
        handleShouldAutoSolve(false)
      } else {
        increaseCurrentAutoRuleIndex()
        handleShouldAutoSolve(true)
      }
    }
  }, [
    checkedRuleIndices,
    currentAutoRuleIndex,
    handleShouldAutoSolve,
    tryRuleAtIndex,
  ])

  const isLoadingFromLocalStorage = [
    isLoadingPuzzleStringCurrent,
    isLoadingPuzzleStringStart,
    isLoadingIsBoardSet,
    isLoadingIsBoardSolved,
    isLoadingRuleOutcomes,
    isLoadingCheckedRuleIndices,
    isLoadingCurrentAutoRuleIndex,
    isLoadingShouldAutoSolve,
    isLoadingShouldShowCandidates,
    isLoadingIsCandidateMode,
    isLoadingManualElimCandidates,
    isLoadingGoodCandidates,
    isLoadingBadCandidates,
    isLoadingHighlightIndex,
    isLoadingLastClickedHighlightIndex,
    isLoadingLastFocusedEntryIndex,
    isLoadingDifficulty,
  ].some(Boolean)

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement
      if (!target.dataset.entry && !target.dataset.padNumber) {
        padNumberClicked.current = false
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSortedEntries(
        entryDivRefs.current.filter((div) => div && div.tabIndex !== -1),
      )
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [isBoardSet])

  useEffect(() => {
    if (
      shouldAutoSolve &&
      isBoardSet &&
      !isBoardSolved &&
      !checkForAnySudokuConflict()
    ) {
      handleShouldAutoSolve(false)
      tryAutoSolves()
    }
  }, [
    isBoardSet,
    isBoardSolved,
    checkForAnySudokuConflict,
    handleShouldAutoSolve,
    shouldAutoSolve,
    tryAutoSolves,
  ])

  const handleCheckboxChange = (ruleIndex: number) => {
    const isNewCheck = !checkedRuleIndices.includes(ruleIndex)

    handleCheckedRuleIndices((prev) => {
      const updatedRules = isNewCheck
        ? [...prev, ruleIndex]
        : prev.filter((n) => n !== ruleIndex)
      return updatedRules.sort((a, b) => a - b)
    })

    if (isNewCheck && isBoardSet) {
      handleShouldAutoSolve(true)
    }
  }

  const toggleCandidateQueueSolveOnElim = useCallback(
    (gridSquareIndex: number, candidateIndex: number) => {
      toggleManualElimCandidate(gridSquareIndex, candidateIndex)
      const candidateKey = `${gridSquareIndex}-${candidateIndex}`
      if (!manualElimCandidates.includes(candidateKey)) {
        handleShouldAutoSolve(true)
      }
    },
    [],
  )

  const restartPuzzle = () => {
    handlePuzzleStringCurrent(formatStringToPuzzleString(puzzleStringStart))
    handleIsBoardSolved(initialStates.isBoardSolved)

    handleRuleOutcomes(initialStates.ruleOutcomes)
    handleCurrentAutoRuleIndex(initialStates.currentAutoRuleIndex)
    handleShouldAutoSolve(initialStates.shouldAutoSolve)

    handleManualElimCandidates(initialStates.manualElimCandidates)
    handleGoodCandidates(initialStates.goodCandidates)
    handleBadCandidates(initialStates.badCandidates)

    handleHighlightIndex(initialStates.highlightIndex)
    handleLastClickedHighlightIndex(initialStates.lastClickedHighlightIndex)
    handleLastFocusedEntryIndex(initialStates.lastFocusedEntryIndex)

    padNumberClicked.current = false
  }

  const resetBoardData = useCallback(() => {
    handlePuzzleStringCurrent(initialStates.puzzleStringCurrent)
    handlePuzzleStringStart(initialStates.puzzleStringStart)
    handleIsBoardSet(initialStates.isBoardSet)
    handleIsBoardSolved(initialStates.isBoardSolved)

    handleRuleOutcomes(initialStates.ruleOutcomes)
    handleCheckedRuleIndices(initialStates.checkedRuleIndices)
    handleCurrentAutoRuleIndex(initialStates.currentAutoRuleIndex)
    handleShouldAutoSolve(initialStates.shouldAutoSolve)

    handleShouldShowCandidates(initialStates.shouldShowCandidates)
    handleIsCandidateMode(initialStates.isCandidateMode)
    handleManualElimCandidates(initialStates.manualElimCandidates)
    handleGoodCandidates(initialStates.goodCandidates)
    handleBadCandidates(initialStates.badCandidates)

    handleHighlightIndex(initialStates.highlightIndex)
    handleLastClickedHighlightIndex(initialStates.lastClickedHighlightIndex)
    handleLastFocusedEntryIndex(initialStates.lastFocusedEntryIndex)
    handleSortedEntries(initialStates.sortedEntries)

    handleDifficulty(initialStates.difficulty)

    padNumberClicked.current = false

    clearLocalStoragePreserve(["theme"])
  }, [])

  function getCandidates(gridSquareIndex: number) {
    const candidateArr = Array.from(
      { length: symbolsLength },
      (_, candidateIndex) => {
        const candidateKey = `${gridSquareIndex}-${candidateIndex}`

        const isSquareOccupied = puzzleStringCurrent[gridSquareIndex] != "0"

        const isAlreadyInUnit = getPeerGridSquareIndices(
          gridSquareIndex,
          symbolsLength,
        ).some((i) => puzzleStringCurrent[i] === symbols[candidateIndex])

        if (
          isSquareOccupied ||
          isAlreadyInUnit ||
          manualElimCandidates.includes(candidateKey)
        ) {
          return false
        } else {
          return true
        }
      },
    )
    return candidateArr
  }

  function checkForAnySudokuConflict() {
    for (let i = 0; i < puzzleStringCurrent.length; i++) {
      const character = puzzleStringCurrent[i]
      if (character !== "0") {
        if (isAlreadyInUnit(i, character, puzzleStringCurrent)) {
          return true
        }
      }
    }
    return false
  }

  function isAlreadyInUnit(
    gridSquareIndex: number,
    character: string,
    puzzleString: string,
  ) {
    if (character == "0" || character == "") return false
    return getPeerGridSquareIndices(gridSquareIndex, symbolsLength).some(
      (i) => {
        if (i < 0 || i >= puzzleString.length) {
          console.error(
            `Index ${i} is out of bounds for puzzleStringCurrent with length ${puzzleString.length}`,
          )
          return false
        }
        return puzzleString[i] == character && i != gridSquareIndex
      },
    )
  }

  function getPeerSquares(gridSquareIndex: number) {
    return allSquares.filter((square) =>
      getPeerGridSquareIndices(gridSquareIndex, symbolsLength).includes(
        square.gridSquareIndex,
      ),
    )
  }

  function checkBoardFilled(puzzleStringCurrent: string) {
    return !puzzleStringCurrent.includes("0")
  }

  function formatStringToPuzzleString(value: string) {
    const zeroReplaced = replaceNonDigitsWithZero(value)
    return truncateAndPad(
      zeroReplaced,
      Math.pow(symbolsLength, 2),
      "0",
      symbols,
    )
  }

  function getValidIndexOrNull(newValue: number | null) {
    return typeof newValue !== "number" ||
      !Number.isInteger(newValue) ||
      newValue < 0 ||
      newValue >= symbolsLength
      ? null
      : newValue
  }

  return {
    puzzleStringCurrent,
    puzzleStringStart,
    handlePuzzleStringStart,
    isBoardSet,
    handleIsBoardSet,
    isBoardSolved,
    ruleOutcomes,
    checkedRuleIndices,
    shouldShowCandidates,
    toggleShouldShowCandidates,
    handleShouldAutoSolve,
    isCandidateMode,
    toggleCandidateMode,
    manualElimCandidates,
    goodCandidates,
    badCandidates,
    highlightIndex,
    handleHighlightIndex,
    lastClickedHighlightIndex,
    handleLastClickedHighlightIndex,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    sortedEntries,
    difficulty,
    handleDifficulty,

    handleEntry,
    handleCheckboxChange,
    tryRuleAtIndex,
    resetBoardData,
    restartPuzzle,
    toggleCandidateQueueSolveOnElim,

    isAlreadyInUnit,
    padNumberClicked,
    charCounts,
    isLoadingFromLocalStorage,
    entryDivRefs,
  }
}

export default useSudokuManagement
export { symbols, symbolsLength, symbolsSqrt, difficultyLevels }
export type { Difficulty }
