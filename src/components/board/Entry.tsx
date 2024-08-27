"use client"

import { useRef, useState, useContext, useEffect, useMemo } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getRowColBox from "@/utils/getRowColBox"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
}

const Entry = ({ gridSquareIndex, shownValue }: EntryProps) => {
  const shownValueRef = useRef(shownValue)
  const [localShownValue, setLocalShownValue] = useState(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const { allUnits, candidateMode, boardIsSet, highlightN, handleQueueAutoSolve, handleEntry } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)
  const { rowIndex, colIndex, boxIndex } = getRowColBox(gridSquareIndex)

  useEffect(() => {
    shownValueRef.current = shownValue
    setLocalShownValue(shownValue)
  }, [shownValue])

  useEffect(() => {
    if (boardIsSet) {
      if (shownValueRef.current) setIsLocked(true)
    } else {
      setIsLocked(false)
    }
  }, [boardIsSet])

  const highlight = useMemo(() => {
    return shownValue === highlightN.toString() ? "highlight" : ""
  }, [highlightN, shownValue])

  const wrong = useMemo(() => {
    return isWrong ? "wrong" : ""
  }, [isWrong])

  const checkIsWrong = (character: string) => {
    return (
      character != "0" &&
      (allUnits.allBoxes[boxIndex].includes(character) ||
        allUnits.allRows[rowIndex].includes(character) ||
        allUnits.allColumns[colIndex].includes(character))
    )
  }

  const handleCharacterEntry = (character: string) => {
    setIsWrong(false)
    const replacementChar = character < "1" || character > "9" ? "0" : character
    setLocalShownValue(replacementChar != "0" ? replacementChar : "")
    if (checkIsWrong(replacementChar)) {
      setIsWrong(true)
      return
    }
    handleEntry(gridSquareIndex, replacementChar)
    handleQueueAutoSolve(true)
  }

  const handleClick = () => {
    if (!isLocked) entryRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLocked && e.key !== shownValue) {
      handleCharacterEntry(e.key)
      entryRef.current?.blur()
    }
  }

  return (
    <div
      ref={entryRef}
      className={`entry ${candidateMode ? "no-pointer" : ""} ${isLocked ? "set" : ""} ${highlight} ${wrong}`}
      tabIndex={gridSquareIndex + 1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {localShownValue}
    </div>
  )
}

export default Entry
