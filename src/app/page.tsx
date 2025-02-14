"use client"

import FetchPuzzleBtn from "@/components/actions/fetch-group/FetchPuzzleBtn"
import "./css/modern-normalize.css"
import Board from "@/components/board/Board"
import CandidateContext from "@/contexts/CandidateContext"
import RuleItem from "@/components/rules/RuleItem"
import rulesArr from "@/rules/rulesArr"
import useSudokuManagement, { Difficulty, difficultyLevels, symbols, symbolsSqrt } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
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
    <SudokuMain>
      <MainTitle>SUDOKU RULER</MainTitle>
      <GameContent>
        <GameInterface>
          <CandidateContext.Provider value={contextObj}>
            <Board boardIsSolved={boardIsSolved} gridSize={symbolsSqrt}>
              {Array.from({ length: symbols.length }).map((_, boxIndex) => (
                <Box key={boxIndex} boxSize={symbolsSqrt}>
                  {Array.from({ length: symbols.length }).map((_, squareIndex) => (
                    <Square key={squareIndex} boxIndex={boxIndex} boxSquareIndex={squareIndex} />
                  ))}
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
        </GameInterface>
        <PuzzleOperations>
          <RulesSection>
            <SectionTitle>Rules</SectionTitle>
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
                  allDefault={ruleOutcomes.every(outcome => outcome === "default")}
                />
              ))}
            </RuleItemList>
          </RulesSection>
          <ActionsSection>
            <SectionTitle>Actions</SectionTitle>
            <Actions>
              <FetchGroup>
                <FetchPuzzleBtn
                  className={clsx("fetch-grid-string-btn col-start-2 rounded-[10px] shadow-[black_0px_0px_3px]", boardIsSet && "hidden")}
                  handlePuzzleStartChange={handlePuzzleStartChange}
                  difficulty={difficulty}
                >
                  Fetch A New Puzzle
                </FetchPuzzleBtn>

                <DifficultySelector<Difficulty>
                  difficulty={difficulty}
                  isHidden={boardIsSet}
                  onChange={e => handleDifficulty(e.target.value as Difficulty)}
                  difficultyLevels={difficultyLevels}
                />
              </FetchGroup>
              <PuzzleStringInput
                puzzleLength={Math.pow(symbols.length, 2)}
                isHidden={boardIsSet}
                puzzleStringStart={puzzleStringStart}
                onChange={e => {
                  handlePuzzleStartChange(e.target.value)
                }}
              />
              <ActionBtnGroup>
                <ClearAllBtn onClick={() => resetBoardData()}>Clear All</ClearAllBtn>
                {boardIsSet ? (
                  <RestartPuzzleBtn onClick={() => restartPuzzle()}>Restart</RestartPuzzleBtn>
                ) : (
                  <SetPuzzleBtn onClick={() => handleBoardSet(true)}>Set Puzzle</SetPuzzleBtn>
                )}
                <ToggleCandidatesBtn onClick={() => toggleShowCandidates()} disabled={candidateMode}>
                  Toggle Candidates
                </ToggleCandidatesBtn>
              </ActionBtnGroup>
            </Actions>
          </ActionsSection>
        </PuzzleOperations>
      </GameContent>
    </SudokuMain>
  )
}
