"use client"

import { useRef, useState, useContext, useEffect, useCallback, useMemo } from "react"
import CandidateContext from "@/contexts/CandidateContext"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
  boxIndex: number
  rowIndex: number
  colIndex: number
}

const Entry = ({ gridSquareIndex, shownValue, boxIndex, rowIndex, colIndex }: EntryProps) => {
  const shownValueRef = useRef(shownValue)
  const [localShownValue, setLocalShownValue] = useState(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const { candidateMode, setPuzzleStringCurrent, boardIsSet, highlightN, allBoxes, allRows, allColumns } =
    useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const highlight = useMemo(() => {
    return shownValue === highlightN ? "highlight" : ""
  }, [highlightN, shownValue])

  const wrong = useMemo(() => {
    return isWrong ? "wrong" : ""
  }, [isWrong])

  const checkIsWrong = (character: string) => {
    return (
      character != "0" &&
      (allBoxes[boxIndex].includes(parseInt(character)) ||
        allRows[rowIndex].includes(parseInt(character)) ||
        allColumns[colIndex].includes(parseInt(character)))
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
    entryRef.current?.blur()
    setPuzzleStringCurrent((prev: string) => prev.slice(0, gridSquareIndex) + replacementChar + prev.slice(gridSquareIndex + 1))
  }

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

  const handleClick = () => {
    if (!isLocked) entryRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isLocked) {
      handleCharacterEntry(e.key)
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
