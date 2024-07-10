"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import { useEffect, useState } from "react"
import CandidateContext from "@/contexts/CandidateContext"

export default function Page() {
  const [gridString, setGridString] = useState("")
  const [highlightCandidates, setHighlightCandidates] = useState(0)
  const [showCandidates, setShowCandidates] = useState(false)
  const [candidateMode, setCandidateMode] = useState(false)
  const [boardIsSet, setBoardIsSet] = useState(false)

  function resetBoardData() {
    setBoardIsSet(false)
    setCandidateMode(false)
    setShowCandidates(false)
    setHighlightCandidates(0)
    setGridString("")
  }

  useEffect(() => {
    if (candidateMode) {
      setShowCandidates(true)
    }
  }, [candidateMode])

  useEffect(() => {
    if (!showCandidates) {
      setCandidateMode(false)
    }
  }, [showCandidates])

  const candidateModeClass: string = candidateMode ? "candidate-mode-on" : ""

  return (
    <div className="container">
      <section className="title">SUDOKU RULER</section>
      <section className="rules">
        <div className="rules-title">Rules</div>
        <ol className="rules-list">{/* <!-- generate with js --> */}</ol>
      </section>
      <CandidateContext.Provider value={{ highlightCandidates, showCandidates, candidateMode }}>
        <Board />
      </CandidateContext.Provider>

      <section className="controls">
        <div className="controls-title">Controls</div>
        <div className="control-buttons">
          <FetchPuzzleButton className="fetch-grid-string-btn" setGridString={setGridString}>
            Fetch A New Puzzle
          </FetchPuzzleButton>
          <input
            type="text"
            placeholder="paste or enter 81-character grid string"
            className="grid-string"
            id="grid-string"
            value={gridString}
            onChange={e => setGridString(e.target.value)}
          />
          <button className="input-grid-string-btn" onClick={() => setHighlightCandidates(prev => prev + 1)}>
            Input grid string and set
          </button>
          <button className="clear-all-btn">Clear All</button>
          <button className="set-puzzle-btn">Set Puzzle</button>
          <button className="toggle-candidates-btn" onClick={() => setShowCandidates(prev => !prev)}>
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
