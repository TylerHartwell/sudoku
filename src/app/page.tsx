"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import "./css/style.css"
import Board from "@/components/board/Board"
import CandidateContext from "@/contexts/CandidateContext"
import PadNumber from "@/components/PadNumber"
import RuleItem from "@/components/RuleItem"
import rulesArr from "@/rules/rulesArr"
import useSudokuManagement from "@/hooks/useSudokuManagement"

export default function Page() {
  const {
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
    handleDifficulty
  } = useSudokuManagement()

  const candidateModeClass: string = candidateMode ? "candidate-mode-on" : ""
  const boardIsSetClass: string = boardIsSet ? "board-is-set" : ""

  const contextObj = {
    getPeerSquares,
    highlightN,
    showCandidates,
    candidateMode,
    puzzleStringStart,
    puzzleStringCurrent,
    handleEntry,
    boardIsSet,
    toggleManualElimCandidate,
    manualElimCandidates,
    handleQueueAutoSolve,
    goodCandidates,
    badCandidates,
    boardIsSolved
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
          <div className="flex justify-between w-full m-1">
            <div className="flex-1"></div>
            <FetchPuzzleButton
              className={`fetch-grid-string-btn justify-self-center ${boardIsSetClass}`}
              handlePuzzleStartChange={handlePuzzleStartChange}
              difficulty={difficulty}
            >
              Fetch A New Puzzle
            </FetchPuzzleButton>
            <div className="flex-1 flex items-center">
              <select
                className={`difficulty m-1 py-0.5 ${boardIsSetClass}`}
                value={difficulty}
                onChange={e => handleDifficulty(e.target.value as "easy" | "medium" | "hard" | "diabolical")}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="diabolical">Diabolical</option>
              </select>
            </div>
          </div>
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
          <div className="flex w-full">
            <button className="clear-all-btn" onClick={() => resetBoardData()}>
              Clear All
            </button>
            <button className={`set-puzzle-btn ${boardIsSetClass}`} onClick={() => handleBoardSet(true)}>
              Set Puzzle
            </button>
            <button className="toggle-candidates-btn" onClick={() => toggleShowCandidates()} disabled={candidateMode}>
              Toggle Candidates
            </button>
          </div>
        </div>
      </section>
      <section className="numberpad">
        {numbers.map(num => (
          <PadNumber
            key={num}
            number={num}
            highlightN={highlightN}
            handleHighlightNChange={handleHighlightNChange}
            lastClickedHighlightN={lastClickedHighlightN}
            changeLastClickedHighlightN={changeLastClickedHighlightN}
          />
        ))}
        <div className="pad-mode-container">
          <button className={`solution-mode-btn ${candidateMode ? "" : "font-bold pointer-events-none"}`} onClick={() => toggleCandidateMode(false)}>
            Solution Mode
          </button>
          <div className={`mode-switch-outer ${candidateModeClass}`} onClick={() => toggleCandidateMode()}>
            <div className={`mode-switch-inner ${candidateModeClass}`}></div>
          </div>
          <button className={`candidate-mode-btn ${candidateMode ? "font-bold pointer-events-none" : ""}`} onClick={() => toggleCandidateMode(true)}>
            Candidate Mode
          </button>
        </div>
      </section>
    </div>
  )
}
