"use client"

import FetchPuzzleButton from "@/components/FetchPuzzleButton"
import "./css/modern-normalize.css"
import Board from "@/components/board/Board"
import CandidateContext from "@/contexts/CandidateContext"
import PadNumber from "@/components/PadNumber"
import RuleItem from "@/components/RuleItem"
import rulesArr from "@/rules/rulesArr"
import useSudokuManagement, { symbols } from "@/hooks/useSudokuManagement"
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
    highlightIndex,
    handleHighlightIndexChange,
    showCandidates,
    toggleShowCandidates,
    candidateMode,
    toggleCandidateMode,
    lastClickedHighlightIndex,
    changeLastClickedHighlightIndex,
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
    boardIsSolved,
    difficulty,
    handleDifficulty,
    isAlreadyInUnit,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked,
    charCounts,
    restartPuzzle,
    entryRefs,
    sortedEntries
  } = useSudokuManagement()

  const contextObj = {
    getPeerSquares,
    highlightIndex,
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
    boardIsSolved,
    isAlreadyInUnit,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClicked,
    charCounts,
    entryRefs,
    sortedEntries
  }

  return (
    <main className="primary md:w-auto md:min-w-fit md:h-max md:min-h-min flex flex-col items-center md:overflow-y-auto ">
      <h1 className="title md:h-[40px] text-center text-[1em] md:text-[2em]">SUDOKU RULER</h1>
      <div className="w-full md:w-full md:max-w-[max(800px,80vw)] md:px-5 flex flex-col md:flex-row-reverse md:justify-center ">
        <div className="w-full md:w-[max(calc(100vh-155px),300px)] flex flex-col md:content-center">
          <CandidateContext.Provider value={contextObj}>
            <Board />
            <section className="numberpad flex md:h-[115px] flex-col items-center">
              <div className="w-full flex justify-around items-center py-[10px]">
                {symbols.map((symbol, index) => (
                  <PadNumber
                    key={index}
                    index={index}
                    highlightIndex={highlightIndex}
                    handleHighlightIndexChange={handleHighlightIndexChange}
                    lastClickedHighlightIndex={lastClickedHighlightIndex}
                    changeLastClickedHighlightIndex={changeLastClickedHighlightIndex}
                  />
                ))}
              </div>
              <div className="pad-mode-container w-full flex py-[5px] mx-auto justify-center items-center gap-[5px]">
                <button
                  className={clsx(
                    "solution-mode-btn h-[90%] w-min border-none flex rounded-[10px] p-[5px] text-center text-[clamp(12px,6vw,16px)] justify-center items-center bg-transparent",
                    !candidateMode && "font-bold pointer-events-none"
                  )}
                  onClick={() => toggleCandidateMode(false)}
                >
                  Solution Mode
                </button>
                <div
                  className={clsx(
                    "mode-switch-outer h-[50px] aspect-[2] min-w-[50px] rounded-[25px] relative my-auto duration-300 cursor-pointer",
                    candidateMode ? "bg-[#d14141]" : "bg-[rgb(43,143,43)]"
                  )}
                  onClick={() => toggleCandidateMode()}
                >
                  <div
                    className={clsx(
                      "mode-switch-inner h-[80%] aspect-square rounded-[50%] bg-white absolute top-[50%] -translate-y-1/2 pointer-events-none duration-300",
                      candidateMode ? "left-[calc(100%-5px)] -translate-x-full" : "left-[5px] translate-x-0"
                    )}
                  ></div>
                </div>
                <button
                  className={clsx(
                    "candidate-mode-btn h-[90%] w-min border-none flex rounded-[10px] p-[5px] text-center text-[clamp(12px,6vw,16px)] justify-center items-center bg-transparent",
                    candidateMode && "font-bold pointer-events-none"
                  )}
                  onClick={() => toggleCandidateMode(true)}
                >
                  Candidate Mode
                </button>
              </div>
            </section>
          </CandidateContext.Provider>
        </div>
        <div className="w-full md:w-auto md:flex-grow md:min-w-fit md:max-w-[40%] md:overflow-auto md:mr-1 flex flex-col justify-between">
          <section className="rules mt-[10px] md:mt-0 text-center">
            <h2>Rules</h2>
            <ol className="mx-[10px] flex flex-col list-none overflow-auto">
              {rulesArr.map((rule, index) => (
                <RuleItem
                  key={index}
                  ruleN={index + 1}
                  ruleName={rule.ruleName}
                  isChecked={checkedRuleIndices.includes(index)}
                  handleCheckboxChange={() => handleCheckboxChange(index)}
                  ruleOutcome={ruleOutcomes[index]}
                  tryRuleAtIndex={() => tryRuleAtIndex(index)}
                  allDefault={ruleOutcomes.every(outcome => outcome === "default")}
                />
              ))}
            </ol>
          </section>
          <section className="controls mt-[10px] md:mt-0 flex flex-col justify-start items-center ">
            <h2 className="controls-title text-center">Controls</h2>
            <div className="relative w-full flex flex-col items-center gap-[2px] overflow-auto">
              <div className="w-full flex pt-1">
                <div className="flex-1"></div>
                <FetchPuzzleButton
                  className={clsx("fetch-grid-string-btn p-2 rounded-[10px] shadow-[black_0px_0px_3px]", boardIsSet && "hidden")}
                  handlePuzzleStartChange={handlePuzzleStartChange}
                  difficulty={difficulty}
                >
                  Fetch A New Puzzle
                </FetchPuzzleButton>
                <div className="flex-1 grow-0"></div>
                <div className="flex-1 flex justify-start items-center">
                  <select
                    name={"difficulty"}
                    className={clsx("difficulty m-1 py-0.5 h-min", boardIsSet && "hidden")}
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
                placeholder={`paste or enter ${Math.pow(symbols.length, 2)}-character puzzle string`}
                className={clsx("grid-string w-[98%] border-none h-[2em] text-[.85em] my-[2px] select-text", boardIsSet && "hidden")}
                id="grid-string"
                value={puzzleStringStart}
                onChange={e => {
                  handlePuzzleStartChange(e.target.value)
                }}
              />
              <div className="flex w-full p-[2px] min-w-0">
                <div className="flex-1">
                  <button
                    className="clear-all-btn w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px]"
                    onClick={() => resetBoardData()}
                  >
                    Clear All
                  </button>
                </div>

                <div className="flex-1"></div>
                <button
                  className={clsx("set-puzzle-btn w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px] active:bg-yellow-200")}
                  onClick={() => {
                    if (boardIsSet) {
                      restartPuzzle()
                    } else {
                      handleBoardSet(true)
                    }
                  }}
                >
                  {boardIsSet ? "Restart" : "Set Puzzle"}
                </button>
                <div className="flex-1"></div>
                <div className="flex-1 flex justify-end">
                  <button
                    className="toggle-candidates-btn w-min text-[clamp(12px,4vw,16px)] rounded-[10px] shadow-[black_0px_0px_3px] justify-self-end disabled:opacity-50"
                    onClick={() => toggleShowCandidates()}
                    disabled={candidateMode}
                  >
                    Toggle Candidates
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
