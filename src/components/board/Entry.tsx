"use client"

import { useRef, useState, useContext, useEffect } from "react"
import CandidateContext from "@/contexts/CandidateContext"

interface EntryProps {
  boxId: number
  squareN: number
  rowN: number
  colN: number
  squareId: number
}

const Entry = ({ boxId, squareN, rowN, colN, squareId }: EntryProps) => {
  const [shownValue, setShownValue] = useState("")
  const shownValueRef = useRef(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const { highlightCandidates, candidateMode, puzzleStringStart, boardIsSet } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const noPointer: string = candidateMode ? "no-pointer" : ""
  const set: string = isLocked ? "set" : ""

  useEffect(() => {
    if (puzzleStringStart[squareId - 1]) {
      handleCharacterEntry(puzzleStringStart[squareId - 1])
    } else {
      handleCharacterEntry("")
    }
  }, [puzzleStringStart, squareId])

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
    if (!isLocked) handleCharacterEntry(e.key)
    entryRef.current?.blur()
  }

  const handleCharacterEntry = (character: string) => {
    if (character < "1" || character > "9") {
      setShownValue("")
    } else {
      setShownValue(character)
    }
  }

  return (
    <div ref={entryRef} className={`entry ${noPointer} ${set}`} tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
      {shownValue}
    </div>
  )
}

export default Entry
