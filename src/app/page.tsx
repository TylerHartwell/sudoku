"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import { useEffect, useMemo, useState } from "react"
import CandidateContext from "@/contexts/CandidateContext"

const newZeroMatrix = () => {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

export default function Page() {
  const [puzzleStringStart, setPuzzleStringStart] = useState("")
  const [puzzleStringCurrent, setPuzzleStringCurrent] = useState("0".repeat(81))
  const [puzzleSolution, setPuzzleSolution] = useState("")
  const [highlightCandidates, setHighlightCandidates] = useState(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [boardIsSet, setBoardIsSet] = useState(false)

  console.log("Page Render")
  console.log("puzzleStringStart:", puzzleStringStart)
  console.log("puzzleStringCurrent:", puzzleStringCurrent)

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

  const allBoxes = useMemo(() => {
    const matrix = newZeroMatrix()
    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
      for (let squareIndex = 0; squareIndex < 9; squareIndex++) {
        const squareId = (squareIndex % 3) + Math.floor(squareIndex / 3) * 9 + Math.floor(boxIndex / 3) * 27 + (boxIndex % 3) * 3
        matrix[boxIndex][squareIndex] = parseInt(puzzleStringCurrent[squareId])
      }
    }
    return matrix
  }, [puzzleStringCurrent])

  const allRows = useMemo(() => {
    const matrix = newZeroMatrix()
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (let squareIndex = 0; squareIndex < 9; squareIndex++) {
        const squareId = rowIndex * 9 + squareIndex
        matrix[rowIndex][squareIndex] = parseInt(puzzleStringCurrent[squareId])
      }
    }
    return matrix
  }, [puzzleStringCurrent])

  const allColumns = useMemo(() => {
    const allColumns = newZeroMatrix()
    for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
      for (let squareIndex = 0; squareIndex < 9; squareIndex++) {
        const squareId = columnIndex + squareIndex * 9
        allColumns[columnIndex][squareIndex] = parseInt(puzzleStringCurrent[squareId])
      }
    }
    return allColumns
  }, [puzzleStringCurrent])

  function resetBoardData() {
    setBoardIsSet(false)
    setCandidateMode(false)
    setShowCandidates(false)
    setHighlightCandidates(0)
    setPuzzleStringStart("")
    setPuzzleStringCurrent("0".repeat(81))
    setPuzzleSolution("")
  }

  // let boardState = {
  //   start: puzzleStringStart,
  //   current: puzzleStringCurrent,
  //   get boxes() {
  //     return [puzzleStringCurrent[0]]
  //   }
  // }

  const truncateAndPad = (inputString: string) => {
    return inputString.slice(0, 81).padEnd(81, "0")
  }

  const candidateModeClass: string = candidateMode ? "candidate-mode-on" : ""
  const boardIsSetClass: string = boardIsSet ? "board-is-set" : ""

  return (
    <div className="container">
      <section className="title">SUDOKU RULER</section>
      <section className="rules">
        <div className="rules-title">Rules</div>
        <ol className="rules-list">{/* <!-- generate with js --> */}</ol>
      </section>
      <CandidateContext.Provider
        value={{
          highlightCandidates,
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
        <div className="pad-number pad1">1</div>
        <div className="pad-number pad2">2</div>
        <div className="pad-number pad3">3</div>
        <div className="pad-number pad4">4</div>
        <div className="pad-number pad5">5</div>
        <div className="pad-number pad6">6</div>
        <div className="pad-number pad7">7</div>
        <div className="pad-number pad8">8</div>
        <div className="pad-number pad9">9</div>
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
