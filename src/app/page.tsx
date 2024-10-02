"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
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
    <div className="container m-auto max-799:my-[2px] hover-fine-device-max-799:ml-[5px] p-[2px] grid [grid-template-areas:'title_title''rules_board''controls_numberpad'] max-799:[grid-template-areas:'title''board''numberpad''rules''controls'] grid-rows-[min-content_1fr_min-content] max-799:grid-rows-[repeat(5,min-content)] grid-cols-[minmax(min-content,_40%)_1fr] max-799:grid-cols-[minmax(min-content,95vw)] min-h-min max-h-full max-799:max-h-min min-w-min max-w-[125vh] max-799:max-w-max">
      <section className="title [grid-area:title] text-center text-[2em]">SUDOKU RULER</section>
      <section className="rules [grid-area:rules] text-center max-799:max-w-full max-799:mt-[10px]">
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

      <section className="controls [grid-area:controls] flex flex-col justify-start items-center border-none w-auto max-799:mt-[10px]">
        <div className="controls-title text-center border-none">Controls</div>
        <div className="flex flex-col w-full border-none items-center relative gap-[2px]">
          <div className="flex justify-between w-full m-1">
            <div className="flex-1"></div>
            <FetchPuzzleButton
              className={clsx("fetch-grid-string-btn w-max rounded-[10px] shadow-[black_0px_0px_3px] justify-self-center", boardIsSet && "hidden")}
              handlePuzzleStartChange={handlePuzzleStartChange}
              difficulty={difficulty}
            >
              Fetch A New Puzzle
            </FetchPuzzleButton>
            <div className="flex-1 flex items-center">
              <select
                className={clsx("difficulty m-1 py-0.5", boardIsSet && "hidden")}
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
            className={clsx("grid-string w-full border-none h-[2em] text-[.85em] m-[2px] select-text", boardIsSet && "hidden")}
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
              className={clsx(
                "set-puzzle-btn w-min rounded-[10px] shadow-[black_0px_0px_3px] justify-self-center active:bg-yellow-200",
                boardIsSet && "hidden"
              )}
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
            <div
              className={clsx(
                "mode-switch-inner h-[40px] w-[40px] rounded-[50%] bg-white absolute top-[50%] -translate-y-1/2 pointer-events-none duration-300",
                candidateMode ? "left-[calc(100%-5px)] -translate-x-full" : "left-[5px] translate-x-0"
              )}
            ></div>
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
