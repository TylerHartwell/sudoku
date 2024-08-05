"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import { useEffect, useMemo, useState } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import PadNumber from "@/components/PadNumber"
import RuleItem from "@/components/RuleItem"
import rulesArr from "@/rules/rulesArr"

const newZeroMatrix = () => {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

const truncateAndPad = (inputString: string) => {
  return inputString.slice(0, 81).padEnd(81, "0")
}

const numbers = Array.from({ length: 9 }, (_, i) => i + 1)

export default function Page() {
  const [puzzleStringStart, setPuzzleStringStart] = useState("")
  const [puzzleStringCurrent, setPuzzleStringCurrent] = useState(() => "0".repeat(81))
  const [puzzleSolution, setPuzzleSolution] = useState("")
  const [highlightN, setHighlightN] = useState<number>(0)
  const [lastClickedHighlightN, setLastClickedHighlightN] = useState(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [boardIsSet, setBoardIsSet] = useState(false)

  console.log("Page Render")

  useEffect(() => {
    console.log("useEffect: puzzleStringStart:", puzzleStringStart)
    if (puzzleStringStart) {
      setPuzzleStringCurrent(truncateAndPad(puzzleStringStart))
    } else {
      setPuzzleStringCurrent("0".repeat(81))
    }
  }, [puzzleStringStart])

  useEffect(() => {
    console.log("useEffect: showCandidates:", showCandidates)
    if (!showCandidates) {
      setCandidateMode(false)
    }
  }, [showCandidates])

  const { allBoxes, allRows, allColumns } = useMemo(() => {
    const boxesMatrix = newZeroMatrix()
    const rowsMatrix = newZeroMatrix()
    const columnsMatrix = newZeroMatrix()

    for (let index = 0; index < 81; index++) {
      const rowIndex = Math.floor(index / 9)
      const colIndex = index % 9
      const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3)
      const value = parseInt(puzzleStringCurrent[index])

      boxesMatrix[boxIndex][(rowIndex % 3) * 3 + (colIndex % 3)] = value
      rowsMatrix[rowIndex][colIndex] = value
      columnsMatrix[colIndex][rowIndex] = value
    }

    return {
      allBoxes: boxesMatrix,
      allRows: rowsMatrix,
      allColumns: columnsMatrix
    }
  }, [puzzleStringCurrent])

  function resetBoardData() {
    setBoardIsSet(false)
    setCandidateMode(false)
    setShowCandidates(false)
    setHighlightN(0)
    setPuzzleStringStart("")
    setPuzzleStringCurrent("0".repeat(81))
    setPuzzleSolution("")
  }

  const candidateModeClass: string = candidateMode ? "candidate-mode-on" : ""
  const boardIsSetClass: string = boardIsSet ? "board-is-set" : ""

  return (
    <div className="container">
      <section className="title">SUDOKU RULER</section>
      <section className="rules">
        <div className="rules-title">Rules</div>
        <ol className="rules-list">
          {rulesArr.map((rule, index) => (
            <RuleItem key={index} ruleN={index + 1} rule={rule} />
          ))}
        </ol>
      </section>
      <CandidateContext.Provider
        value={{
          highlightN,
          showCandidates,
          candidateMode,
          puzzleStringStart,
          puzzleStringCurrent,
          setPuzzleStringCurrent,
          boardIsSet,
          allBoxes,
          allRows,
          allColumns
        }}
      >
        <Board />
      </CandidateContext.Provider>

      <section className="controls">
        <div className="controls-title">Controls</div>
        <div className="control-buttons">
          <FetchPuzzleButton
            className={`fetch-grid-string-btn ${boardIsSetClass}`}
            setPuzzleStringStart={setPuzzleStringStart}
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
              setPuzzleStringStart(e.target.value)
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
