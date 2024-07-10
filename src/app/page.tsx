"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import { useState } from "react"
import { createContext } from "react"
import CandidateHighlightContext from "@/contexts/CandidateHighlightContext"

export default function Page() {
  const [gridString, setGridString] = useState("")
  const [highlightCandidates, setHighlightCandidates] = useState(false)

  return (
    <div className="container">
      <section className="title">SUDOKU RULER</section>
      <section className="rules">
        <div className="rules-title">Rules</div>
        <ol className="rules-list">{/* <!-- generate with js --> */}</ol>
      </section>
      <CandidateHighlightContext.Provider value={highlightCandidates}>
        <Board />
      </CandidateHighlightContext.Provider>

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
          <button className="input-grid-string-btn" onClick={() => setHighlightCandidates(prev => !prev)}>
            Input grid string and set
          </button>
          <button className="clear-all-btn">Clear All</button>
          <button className="set-puzzle-btn">Set Puzzle</button>
          <button className="toggle-candidates-btn">Toggle Candidates</button>
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
          <button className="solution-mode-btn">Solution Mode</button>
          <div className="mode-switch-outer">
            <div className="mode-switch-inner"></div>
          </div>
          <button className="candidate-mode-btn">Candidate Mode</button>
        </div>
      </section>
    </div>
  )
}
