"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import PadNumber from "@/components/PadNumber"
import RuleItem from "@/components/RuleItem"
import rulesArr from "@/rules/rulesArr"
import calculateAllUnits from "@/utils/calculateAllUnits"
import truncateAndPad from "@/utils/truncateAndPad"
import { RuleOutcome } from "@/rules/rulesInterface"

export default function Page() {
  const [puzzleStringStart, setPuzzleStringStart] = useState("")
  const [puzzleStringCurrent, setPuzzleStringCurrent] = useState(() => "0".repeat(81))
  const [puzzleSolution, setPuzzleSolution] = useState("")
  const [highlightN, setHighlightN] = useState<number>(0)
  const [lastClickedHighlightN, setLastClickedHighlightN] = useState(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [boardIsSet, setBoardIsSet] = useState(false)
  const [manualElimCandidates, setManualElimCandidates] = useState<string[]>([])
  const [checkedRules, setCheckedRules] = useState<number[]>([])
  const [ruleOutcomes, setRuleOutcomes] = useState<RuleOutcome[]>(rulesArr.map(_ => "default"))
  const [currentAutoRuleIndex, setCurrentAutoRuleIndex] = useState<number>(0)
  const [queueAutoSolve, setQueueAutoSolve] = useState<boolean>(false)

  console.log("Page Render")

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
      console.log("tryRuleAtIndex ", ruleIndex, "isAuto ", isAuto)
      const outcomeTime = isAuto ? 0 : 500
      const ruleProgresses = rulesArr[ruleIndex].ruleAttempt(allSquares, handleCandidateEliminate, handleEntry)

      const ruleOutcome: RuleOutcome = ruleProgresses ? "success" : "fail"

      handleRuleOutcome(ruleIndex, ruleOutcome)

      await new Promise(resolve => setTimeout(resolve, outcomeTime))

      if (ruleProgresses) {
        ruleProgresses()
        setQueueAutoSolve(true)
      }

      handleRuleOutcome(ruleIndex, "default")

      return ruleOutcome === "success"
    },
    [allSquares]
  )

  const tryAutoSolves = useCallback(async () => {
    if (currentAutoRuleIndex >= checkedRules.length) {
      setCurrentAutoRuleIndex(0)
      setQueueAutoSolve(false)
      return
    }
    const ruleIndex = checkedRules[currentAutoRuleIndex]

    const isSuccess = await tryRuleAtIndex(ruleIndex, true)

    if (isSuccess) {
      setCurrentAutoRuleIndex(0)
    } else {
      setCurrentAutoRuleIndex(prev => prev + 1)
    }

    setQueueAutoSolve(true)
  }, [checkedRules, currentAutoRuleIndex, tryRuleAtIndex])

  useEffect(() => {
    if (queueAutoSolve) {
      setQueueAutoSolve(false)
      tryAutoSolves()
    }
  }, [queueAutoSolve, tryAutoSolves])

  const handleRuleOutcome = (ruleIndex: number, newOutcome: RuleOutcome) => {
    setRuleOutcomes(prev => {
      const updatedOutcomes = [...prev]

      updatedOutcomes[ruleIndex] = newOutcome

      return updatedOutcomes
    })
  }

  const handleEntry = (gridSquareIndex: number, newEntry: string) => {
    setPuzzleStringCurrent(prev => {
      return prev.slice(0, gridSquareIndex) + newEntry + prev.slice(gridSquareIndex + 1)
    })
  }

  const handleCandidateEliminate = (gridSquareIndex: number, candidateN: number) => {
    const candidateKey = `${gridSquareIndex}-${candidateN}`
    setManualElimCandidates(prev => {
      if (!prev.includes(candidateKey)) {
        return [...prev, candidateKey]
      } else {
        return prev
      }
    })
  }

  const handleToggleEliminated = (gridSquareIndex: number, candidateN: number) => {
    const candidateKey = `${gridSquareIndex}-${candidateN}`
    setManualElimCandidates(prev => {
      if (prev.includes(candidateKey)) {
        return prev.filter(key => key !== candidateKey)
      } else {
        return [...prev, candidateKey]
      }
    })
  }

  const handleCheckboxChange = (ruleIndex: number) => {
    const isNewCheck = !checkedRules.includes(ruleIndex)

    setCheckedRules(prev => {
      const updatedRules = isNewCheck ? [...prev, ruleIndex] : prev.filter(n => n !== ruleIndex)
      return updatedRules.sort((a, b) => a - b)
    })

    if (isNewCheck) {
      setQueueAutoSolve(true)
    }
  }

  const handlePuzzleStartChange = (newValue: string) => {
    setPuzzleStringStart(newValue)
    if (newValue) {
      setPuzzleStringCurrent(truncateAndPad(newValue, 81, "0"))
    } else {
      setPuzzleStringCurrent("0".repeat(81))
    }
  }

  function resetBoardData() {
    setBoardIsSet(false)
    setCandidateMode(false)
    setShowCandidates(false)
    setHighlightN(0)
    handlePuzzleStartChange("")
    setPuzzleSolution("")
    setLastClickedHighlightN(0)
    setManualElimCandidates([])
  }

  const candidateModeClass: string = candidateMode ? "candidate-mode-on" : ""
  const boardIsSetClass: string = boardIsSet ? "board-is-set" : ""

  const contextObj = {
    highlightN,
    showCandidates,
    candidateMode,
    puzzleStringStart,
    puzzleStringCurrent,
    setPuzzleStringCurrent,
    boardIsSet,
    allUnits,
    handleToggleEliminated,
    manualElimCandidates
  }

  return (
    <div className="container">
      <section className="title">SUDOKU RULER</section>
      <section className="rules">
        <div className="rules-title">Rules</div>
        <ol className="rules-list">
          {rulesArr.map((rule, index) => (
            <RuleItem
              key={index}
              ruleN={index + 1}
              ruleName={rule.ruleName}
              isChecked={checkedRules.includes(index)}
              handleCheckboxChange={() => handleCheckboxChange(index)}
              ruleOutcome={ruleOutcomes[index]}
              tryRuleAtIndex={() => tryRuleAtIndex(index)}
              allDefault={ruleOutcomes.every(outcome => outcome === "default")}
            />
          ))}
        </ol>
      </section>
      <CandidateContext.Provider value={contextObj}>
        <Board />
      </CandidateContext.Provider>

      <section className="controls">
        <div className="controls-title">Controls</div>
        <div className="control-buttons">
          <FetchPuzzleButton
            className={`fetch-grid-string-btn ${boardIsSetClass}`}
            handlePuzzleStartChange={handlePuzzleStartChange}
            setPuzzleSolution={setPuzzleSolution}
          >
            Fetch A New Puzzle
          </FetchPuzzleButton>
          <input
            type="text"
            placeholder="paste or enter 81-character grid string"
            className={`grid-string ${boardIsSetClass}`}
            id="grid-string"
            value={puzzleStringStart}
            onChange={e => {
              handlePuzzleStartChange(e.target.value)
            }}
          />
          <button className="clear-all-btn" onClick={() => resetBoardData()}>
            Clear All
          </button>
          <button className={`set-puzzle-btn ${boardIsSetClass}`} onClick={() => setBoardIsSet(true)}>
            Set Puzzle
          </button>
          <button className="toggle-candidates-btn" onClick={() => setShowCandidates(prev => !prev)} disabled={candidateMode}>
            Toggle Candidates
          </button>
        </div>
      </section>
      <section className="numberpad">
        {numbers.map(num => (
          <PadNumber
            key={num}
            number={num}
            highlightN={highlightN}
            setHighlightN={setHighlightN}
            lastClickedHighlightN={lastClickedHighlightN}
            setLastClickedHighlightN={setLastClickedHighlightN}
          />
        ))}
        <div className="pad-mode-container">
          <button className={`solution-mode-btn ${candidateModeClass}`} onClick={() => setCandidateMode(false)}>
            Solution Mode
          </button>
          <div className={`mode-switch-outer ${candidateModeClass}`} onClick={() => setCandidateMode(prev => !prev)}>
            <div className={`mode-switch-inner ${candidateModeClass}`}></div>
          </div>
          <button className={`candidate-mode-btn ${candidateModeClass}`} onClick={() => setCandidateMode(true)}>
            Candidate Mode
          </button>
        </div>
      </section>
    </div>
  )
}
