"use client"

import FetchPuzzleBtn from "@/components/actions/FetchPuzzleBtn"
import "./css/modern-normalize.css"
import Board from "@/components/board/Board"
import CandidateContext from "@/contexts/CandidateContext"
import RuleItem from "@/components/rules/RuleItem"
import rulesArr from "@/rules/rulesArr"
import useSudokuManagement, { Difficulty, difficultyLevels, symbols } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
import Controls from "@/components/controls/Controls"
import PadNumbers from "@/components/controls/PadNumbers"
import InputModeSelector from "@/components/controls/InputModeSelector"
import PadNumber from "@/components/controls/PadNumber"
import InputModeBtn from "@/components/controls/InputModeBtn"
import InputModeSwitch from "@/components/controls/InputModeSwitch"
import ToggleCandidatesBtn from "@/components/actions/ToggleCandidatesBtn"
import ClearAllBtn from "@/components/actions/ClearAllBtn"
import RestartPuzzleBtn from "@/components/actions/RestartPuzzleBtn"
import SetPuzzleBtn from "@/components/actions/SetPuzzleBtn"
import PuzzleStringInput from "@/components/actions/PuzzleStringInput"
import DifficultySelector from "@/components/actions/DifficultySelector"

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
    toggleCandidateQueueSolveOnElim,
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
    toggleCandidateQueueSolveOnElim,
    sortedEntries
  }

  return (
    <main className="primary md:w-auto md:min-w-fit md:h-max md:min-h-min flex flex-col items-center md:overflow-y-auto ">
      <h1 className="title md:h-[40px] text-center text-[1em] md:text-[2em]">SUDOKU RULER</h1>
      <div className="w-full md:w-full md:max-w-[max(800px,80vw)] md:px-5 flex flex-col md:flex-row-reverse md:justify-center ">
        <div className="w-full md:w-[max(calc(100vh-155px),300px)] flex flex-col md:content-center">
          <CandidateContext.Provider value={contextObj}>
            <Board />
            <Controls>
              <PadNumbers>
                {symbols.map((symbol, index) => (
                  <PadNumber
                    key={index}
                    index={index}
                    symbol={symbol}
                    symbolsLength={symbols.length}
                    highlightIndex={highlightIndex}
                    handleHighlightIndexChange={handleHighlightIndexChange}
                    lastClickedHighlightIndex={lastClickedHighlightIndex}
                    changeLastClickedHighlightIndex={changeLastClickedHighlightIndex}
                  />
                ))}
              </PadNumbers>
              <InputModeSelector>
                <InputModeBtn isModeActive={!candidateMode} onClick={() => toggleCandidateMode(false)}>
                  Solution Mode
                </InputModeBtn>
                <InputModeSwitch isRightMode={candidateMode} onClick={() => toggleCandidateMode()} />
                <InputModeBtn isModeActive={candidateMode} onClick={() => toggleCandidateMode(true)}>
                  Candidate Mode
                </InputModeBtn>
              </InputModeSelector>
            </Controls>
          </CandidateContext.Provider>
        </div>
        <div className="w-full md:w-auto md:grow md:min-w-fit md:max-w-[40%] md:overflow-auto md:mr-1 flex flex-col justify-between">
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
          <section className="actions mt-[10px] md:mt-0 flex flex-col justify-start items-center ">
            <h2 className="actions-title text-center">Actions</h2>
            <div className="relative w-full flex flex-col items-center gap-[2px] overflow-auto">
              <div className="w-full flex pt-1">
                <div className="flex-1"></div>
                <FetchPuzzleBtn
                  className={clsx("fetch-grid-string-btn p-2 rounded-[10px] shadow-[black_0px_0px_3px]", boardIsSet && "hidden")}
                  handlePuzzleStartChange={handlePuzzleStartChange}
                  difficulty={difficulty}
                >
                  Fetch A New Puzzle
                </FetchPuzzleBtn>
                <div className="flex-1 grow-0"></div>
                <div className="flex-1 flex justify-start items-center">
                  <DifficultySelector<Difficulty>
                    difficulty={difficulty}
                    isHidden={boardIsSet}
                    onChange={e => handleDifficulty(e.target.value as Difficulty)}
                    difficultyLevels={difficultyLevels}
                  />
                </div>
              </div>
              <PuzzleStringInput
                puzzleLength={Math.pow(symbols.length, 2)}
                isHidden={boardIsSet}
                puzzleStringStart={puzzleStringStart}
                onChange={e => {
                  handlePuzzleStartChange(e.target.value)
                }}
              />
              <div className="flex w-full p-[2px] min-w-0">
                <div className="flex-1">
                  <ClearAllBtn onClick={() => resetBoardData()}>Clear All</ClearAllBtn>
                </div>

                <div className="flex-1"></div>
                {boardIsSet ? (
                  <RestartPuzzleBtn onClick={() => restartPuzzle()}>Restart</RestartPuzzleBtn>
                ) : (
                  <SetPuzzleBtn onClick={() => handleBoardSet(true)}>Set Puzzle</SetPuzzleBtn>
                )}
                <div className="flex-1"></div>
                <div className="flex-1 flex justify-end">
                  <ToggleCandidatesBtn onClick={() => toggleShowCandidates()} disabled={candidateMode}>
                    Toggle Candidates
                  </ToggleCandidatesBtn>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
