"use client"

import { useRef, useState, useContext, useEffect, useCallback, useMemo } from "react"
import CandidateContext from "@/contexts/CandidateContext"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
}

const Entry = ({ gridSquareIndex, shownValue }: EntryProps) => {
  const shownValueRef = useRef(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const { candidateMode, setPuzzleStringCurrent, boardIsSet, highlightN } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const highlight = useMemo(() => {
    return shownValue == highlightN ? "highlight" : ""
  }, [highlightN, shownValue])

  const handleCharacterEntry = (character: string) => {
    const replacementChar = character < "1" || character > "9" ? "0" : character

    setPuzzleStringCurrent((prev: string) => prev.slice(0, gridSquareIndex) + replacementChar + prev.slice(gridSquareIndex + 1))
  }

  useEffect(() => {
    shownValueRef.current = shownValue
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
    if (!isLocked) handleCharacterEntry(e.key)
    entryRef.current?.blur()
  }

  return (
    <div
      ref={entryRef}
      className={`entry ${candidateMode ? "no-pointer" : ""} ${isLocked ? "set" : ""} ${highlight}`}
      tabIndex={gridSquareIndex + 1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {shownValue}
    </div>
  )
}

export default Entry
