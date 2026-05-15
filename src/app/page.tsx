"use client"

import FetchPuzzleBtn from "@/components/actions/fetch-group/FetchPuzzleBtn"
import Board from "@/components/board/Board"
import RuleItem from "@/components/rules/RuleItem"
import rulesArr from "@/rules/rulesArr"
import useSudokuManagement, {
  Difficulty,
  difficultyLevels,
  symbols,
  symbolsLength,
  symbolsSqrt,
} from "@/hooks/useSudokuManagement"
import Controls from "@/components/controls/Controls"
import PadNumbers from "@/components/controls/PadNumbers"
import InputModeSelector from "@/components/controls/InputModeSelector"
import PadNumber from "@/components/controls/PadNumber"
import InputModeBtn from "@/components/controls/InputModeBtn"
import InputModeSwitch from "@/components/controls/InputModeSwitch"
import ToggleCandidatesBtn from "@/components/actions/action-btn-group/ToggleCandidatesBtn"
import ClearAllBtn from "@/components/actions/action-btn-group/ClearAllBtn"
import RestartPuzzleBtn from "@/components/actions/action-btn-group/RestartPuzzleBtn"
import SetPuzzleBtn from "@/components/actions/action-btn-group/SetPuzzleBtn"
import UndoBtn from "@/components/actions/action-btn-group/UndoBtn"
import RedoBtn from "@/components/actions/action-btn-group/RedoBtn"
import PuzzleStringInput from "@/components/actions/PuzzleStringInput"
import DifficultySelector from "@/components/actions/fetch-group/DifficultySelector"
import ActionBtnGroup from "@/components/actions/action-btn-group/ActionBtnGroup"
import FetchGroup from "@/components/actions/fetch-group/FetchGroup"
import Actions from "@/components/actions/Actions"
import ActionsSection from "@/components/actions/ActionsSection"
import RuleItemList from "@/components/rules/RuleItemList"
import SectionTitle from "@/components/SectionTitle"
import RulesSection from "@/components/rules/RulesSection"
import GameInterface from "@/components/GameInterface"
import PuzzleOperations from "@/components/PuzzleOperations"
import GameContent from "@/components/GameContent"
import MainTitle from "@/components/MainTitle"
import SudokuMain from "@/components/SudokuMain"
import Box from "@/components/board/Box"
import Square from "@/components/board/Square"
import Entry from "@/components/board/Entry"
import Candidate from "@/components/board/Candidate"
import getGridSquareIndex from "@/utils/sudoku/getGridSquareIndex"
import Header from "@/components/Header"
import ThemeSelector from "@/components/ThemeSelector"

export default function Page() {
  const {
    ruleOutcomes,
    puzzleStringCurrent,
    handleEntry,
    puzzleStringStart,
    handlePuzzleStringStart,
    isBoardSet,
    handleIsBoardSet,
    highlightIndex,
    handleHighlightIndex,
    shouldShowCandidates,
    toggleShouldShowCandidates,
    isCandidateMode,
    toggleCandidateMode,
    lastClickedHighlightIndex,
    handleLastClickedHighlightIndex,
    manualElimCandidates,
    handleShouldAutoSolve,
    checkedRuleIndices,
    handleCheckboxChange,
    tryRuleAtIndex,
    resetBoardData,
    goodCandidates,
    badCandidates,
    isBoardSolved,
    difficulty,
    handleDifficulty,
    isAlreadyInUnit,
    lastFocusedEntryIndex,
    handleLastFocusedEntryIndex,
    padNumberClickedRef,
    charCounts,
    restartPuzzle,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleCandidateQueueSolveOnElim,
    startAutoSolve,
    stopAutoSolve,
    isAutoSolving,
    shouldLoopAutoSolveOnSuccess,
    toggleShouldLoopAutoSolveOnSuccess,
    sortedEntries,
    isLoadingFromLocalStorage,
    entryElementsRef,
  } = useSudokuManagement()

  if (isLoadingFromLocalStorage) {
    return (
      <div
        className="bg-primary text-copy flex h-screen items-center justify-center text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="flex" aria-label="Loading saved puzzle">
          Loading
          <span className="animate-dot-bouncey">.</span>
          <span className="animate-dot-bouncey [animation-delay:0.2s]">.</span>
          <span className="animate-dot-bouncey [animation-delay:0.4s]">.</span>
        </span>
      </div>
    )
  }

  return (
    <SudokuMain>
      <Header>
        <MainTitle>SUDOKU RULER</MainTitle>
      </Header>
      <GameContent>
        <GameInterface>
          <ThemeSelector />
          <Board isBoardSolved={isBoardSolved} gridSize={symbolsSqrt}>
            {Array.from({ length: symbolsLength }).map((_, boxIndex) => (
              <Box key={boxIndex} boxSize={symbolsSqrt}>
                {Array.from({ length: symbolsLength }).map((_, squareIndex) => {
                  const gridSquareIndex = getGridSquareIndex(
                    boxIndex,
                    squareIndex,
                    symbolsLength,
                  )

                  const shownValue =
                    puzzleStringCurrent[gridSquareIndex] == "0"
                      ? ""
                      : puzzleStringCurrent[gridSquareIndex]

                  return (
                    <Square key={squareIndex} squareSize={symbolsSqrt}>
                      <Entry
                        gridSquareIndex={gridSquareIndex}
                        shownValue={shownValue}
                        puzzleStringStart={puzzleStringStart}
                        puzzleStringCurrent={puzzleStringCurrent}
                        isCandidateMode={isCandidateMode}
                        isBoardSet={isBoardSet}
                        highlightIndex={highlightIndex}
                        handleEntry={handleEntry}
                        manualElimCandidates={manualElimCandidates}
                        isAlreadyInUnit={isAlreadyInUnit}
                        handleLastFocusedEntryIndex={
                          handleLastFocusedEntryIndex
                        }
                        padNumberClickedRef={padNumberClickedRef}
                        handleShouldAutoSolve={handleShouldAutoSolve}
                        lastFocusedEntryIndex={lastFocusedEntryIndex}
                        toggleCandidateQueueSolveOnElim={
                          toggleCandidateQueueSolveOnElim
                        }
                        sortedEntries={sortedEntries}
                        symbols={symbols}
                        symbolsLength={symbolsLength}
                        entryElementsRef={entryElementsRef}
                      />
                      {symbols.map((symbol, index) => (
                        <Candidate
                          key={index}
                          symbol={symbol}
                          gridSquareIndex={gridSquareIndex}
                          candidateIndex={index}
                          entryShownValue={shownValue}
                          puzzleStringCurrent={puzzleStringCurrent}
                          highlightIndex={highlightIndex}
                          shouldShowCandidates={shouldShowCandidates}
                          isCandidateMode={isCandidateMode}
                          manualElimCandidates={manualElimCandidates}
                          goodCandidates={goodCandidates}
                          badCandidates={badCandidates}
                          toggleCandidateQueueSolveOnElim={
                            toggleCandidateQueueSolveOnElim
                          }
                          symbolsLength={symbolsLength}
                          boxSize={symbolsSqrt}
                        />
                      ))}
                    </Square>
                  )
                })}
              </Box>
            ))}
          </Board>
          <Controls>
            <PadNumbers>
              {symbols.map((symbol, index) => (
                <PadNumber
                  key={index}
                  index={index}
                  symbol={symbol}
                  symbolsLength={symbolsLength}
                  highlightIndex={highlightIndex}
                  handleHighlightIndex={handleHighlightIndex}
                  lastClickedHighlightIndex={lastClickedHighlightIndex}
                  handleLastClickedHighlightIndex={
                    handleLastClickedHighlightIndex
                  }
                  lastFocusedEntryIndex={lastFocusedEntryIndex}
                  handleLastFocusedEntryIndex={handleLastFocusedEntryIndex}
                  padNumberClickedRef={padNumberClickedRef}
                  handleEntry={handleEntry}
                  isCandidateMode={isCandidateMode}
                  charCounts={charCounts}
                  handleShouldAutoSolve={handleShouldAutoSolve}
                  puzzleStringCurrent={puzzleStringCurrent}
                  isAlreadyInUnit={isAlreadyInUnit}
                  manualElimCandidates={manualElimCandidates}
                  toggleCandidateQueueSolveOnElim={
                    toggleCandidateQueueSolveOnElim
                  }
                />
              ))}
            </PadNumbers>
            <InputModeSelector>
              <InputModeBtn
                isModeActive={!isCandidateMode}
                onClick={() => toggleCandidateMode(false)}
              >
                Solution Mode
              </InputModeBtn>
              <InputModeSwitch
                isRightMode={isCandidateMode}
                onClick={() => toggleCandidateMode()}
              />
              <InputModeBtn
                isModeActive={isCandidateMode}
                onClick={() => toggleCandidateMode(true)}
              >
                Candidate Mode
              </InputModeBtn>
            </InputModeSelector>
          </Controls>
        </GameInterface>
        <PuzzleOperations>
          <RulesSection>
            {/* <SectionTitle>Rules</SectionTitle> */}
            <div className="mx-2.5 mb-1 flex items-center justify-end gap-4">
              <label className="flex items-center gap-1.5 text-[clamp(12px,4vw,16px)]">
                <span>Loop</span>
                <input
                  type="checkbox"
                  checked={shouldLoopAutoSolveOnSuccess}
                  onChange={toggleShouldLoopAutoSolveOnSuccess}
                  disabled={isAutoSolving}
                  aria-label="Repeat autosolve after a successful step"
                />
              </label>
              <button
                type="button"
                className="rounded-[10px] border border-secondary px-3 py-1 text-sm font-semibold transition-colors has-hover:hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={startAutoSolve}
                disabled={
                  isAutoSolving ||
                  checkedRuleIndices.length === 0 ||
                  !isBoardSet ||
                  isBoardSolved
                }
                aria-label="Run checked rules until first success or repeat if enabled"
              >
                Run
              </button>
            </div>
            <RuleItemList>
              {rulesArr.map((rule, index) => (
                <RuleItem
                  key={index}
                  ruleN={index + 1}
                  ruleName={rule.ruleName}
                  isChecked={checkedRuleIndices.includes(index)}
                  handleCheckboxChange={() => handleCheckboxChange(index)}
                  ruleOutcome={ruleOutcomes[index]}
                  tryRuleAtIndex={() => tryRuleAtIndex(index)}
                  allDefault={ruleOutcomes.every(
                    (outcome) => outcome === "default",
                  )}
                  interactionDisabled={isAutoSolving}
                />
              ))}
            </RuleItemList>
            {isAutoSolving && (
              <div className="mt-2 flex justify-end pr-1">
                <button
                  type="button"
                  className="rounded-[10px] border border-red-500 px-3 py-1 text-sm transition-colors has-hover:hover:bg-red-500 has-hover:hover:text-white"
                  onClick={stopAutoSolve}
                >
                  Stop Autosolve
                </button>
              </div>
            )}
          </RulesSection>
          <ActionsSection>
            {/* <SectionTitle>Actions</SectionTitle> */}
            <Actions>
              <div className="relative w-full h-22 flex flex-col justify-center">
                <div
                  className={isBoardSet ? "invisible pointer-events-none" : ""}
                  aria-hidden={isBoardSet}
                >
                  <FetchGroup>
                    <FetchPuzzleBtn
                      handlePuzzleStringStart={handlePuzzleStringStart}
                      difficulty={difficulty}
                      isHidden={false}
                    >
                      Fetch A New Puzzle
                    </FetchPuzzleBtn>
                    <DifficultySelector
                      difficulty={difficulty}
                      isHidden={false}
                      onChange={(e) =>
                        handleDifficulty(e.target.value as Difficulty)
                      }
                      difficultyLevels={difficultyLevels}
                    />
                  </FetchGroup>
                  <PuzzleStringInput
                    puzzleLength={Math.pow(symbolsLength, 2)}
                    isHidden={false}
                    puzzleStringStart={puzzleStringStart}
                    onChange={(e) => {
                      handlePuzzleStringStart(e.target.value)
                    }}
                  />
                </div>
                <div
                  className={`absolute inset-0 flex w-full items-center justify-center ${
                    isBoardSet ? "" : "invisible pointer-events-none"
                  }`}
                  aria-hidden={!isBoardSet}
                >
                  <div className="flex items-center gap-2">
                    <UndoBtn onClick={undo} disabled={!canUndo || isAutoSolving}>
                      Undo
                    </UndoBtn>
                    <RedoBtn onClick={redo} disabled={!canRedo || isAutoSolving}>
                      Redo
                    </RedoBtn>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center w-full min-h-8">
                <div className="flex-1 flex justify-start">
                  <ClearAllBtn onClick={() => resetBoardData()}>
                    Clear All
                  </ClearAllBtn>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="pointer-events-auto">
                    {isBoardSet ? (
                      <RestartPuzzleBtn onClick={() => restartPuzzle()}>
                        Restart
                      </RestartPuzzleBtn>
                    ) : (
                      <SetPuzzleBtn
                        onClick={() => handleIsBoardSet(true)}
                        puzzleLength={Math.pow(symbolsLength, 2)}
                        puzzleStringStart={puzzleStringStart}
                      >
                        Set Puzzle
                      </SetPuzzleBtn>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  <ToggleCandidatesBtn
                    onClick={() => toggleShouldShowCandidates()}
                    disabled={isCandidateMode}
                  >
                    Toggle Candidates
                  </ToggleCandidatesBtn>
                </div>
              </div>
            </Actions>
          </ActionsSection>
        </PuzzleOperations>
      </GameContent>
    </SudokuMain>
  )
}
