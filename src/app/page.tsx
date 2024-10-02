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
import clsx from "clsx"

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
    <div className="container m-auto p-[2px] grid [grid-template-areas:'title_title''rules_board''controls_numberpad'] grid-rows-[min-content_1fr_min-content] grid-cols-[minmax(min-content,_40%)_1fr] min-h-min max-h-full min-w-min max-w-[125vh]">
      <section className="title [grid-area:title] text-center text-[2em]">SUDOKU RULER</section>
      <section className="rules [grid-area:rules] text-center">
        <div>Rules</div>
        <ol className="border-none my-0 mx-[10px] flex flex-col list-none p-0">
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

      <section className="controls [grid-area:controls] flex flex-col justify-start items-center border-none w-auto">
        <div className="controls-title">Controls</div>
        <div className="control-buttons">
          <div className="flex justify-between w-full m-1">
            <div className="flex-1"></div>
            <FetchPuzzleButton
              className={`fetch-grid-string-btn w-max rounded-[10px] shadow-[black_0px_0px_3px] justify-self-center ${boardIsSetClass}`}
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
            className={`grid-string w-full border-none h-[2em] text-[.85em] m-[2px] select-text ${boardIsSetClass}`}
            id="grid-string"
            value={puzzleStringStart}
            onChange={e => {
              handlePuzzleStartChange(e.target.value)
            }}
          />
          <div className="grid grid-cols-3 w-full p-[2px]">
            <button className="clear-all-btn w-min rounded-[10px] shadow-[black_0px_0px_3px]" onClick={() => resetBoardData()}>
              Clear All
            </button>
            <button
              className={`set-puzzle-btn w-min rounded-[10px] shadow-[black_0px_0px_3px] justify-self-center active:bg-yellow-200 ${boardIsSetClass}`}
              onClick={() => handleBoardSet(true)}
            >
              Set Puzzle
            </button>
            <button
              className="toggle-candidates-btn w-min rounded-[10px] shadow-[black_0px_0px_3px] justify-self-end col-start-3 disabled:opacity-50"
              onClick={() => toggleShowCandidates()}
              disabled={candidateMode}
            >
              Toggle Candidates
            </button>
          </div>
        </div>
      </section>
      <section className="numberpad [grid-area:numberpad] h-full flex border-none my-auto mx-0 flex-wrap">
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
        <div className="pad-mode-container flex my-[5px] mx-auto justify-center items-center">
          <button
            className={clsx(
              "solution-mode-btn h-[90%] w-[100px] border-none flex rounded-[10px] p-[5px] text-center justify-center items-center bg-transparent",
              !candidateMode && "font-bold pointer-events-none"
            )}
            onClick={() => toggleCandidateMode(false)}
          >
            Solution Mode
          </button>
          <div
            className={clsx(
              "mode-switch-outer h-[50px] w-[100px] rounded-[25px] relative my-auto mx-[5px] duration-300 cursor-pointer",
              candidateMode ? "bg-[#d14141]" : "bg-[rgb(43,143,43)]"
            )}
            onClick={() => toggleCandidateMode()}
          >
            <div className={`mode-switch-inner ${candidateModeClass}`}></div>
          </div>
          <button
            className={clsx(
              "candidate-mode-btn h-[90%] w-[100px] border-none flex rounded-[10px] p-[5px] text-center justify-center items-center bg-transparent",
              candidateMode && "font-bold pointer-events-none"
            )}
            onClick={() => toggleCandidateMode(true)}
          >
            Candidate Mode
          </button>
        </div>
      </section>
    </div>
  )
}
