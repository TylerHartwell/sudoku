"use client"

import { useRef, useState, useContext, useEffect, useMemo } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import classNames from "classnames"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
}

const Entry = ({ gridSquareIndex, shownValue }: EntryProps) => {
  const shownValueRef = useRef(shownValue)
  const [localShownValue, setLocalShownValue] = useState(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const { puzzleStringCurrent, candidateMode, boardIsSet, highlightN, handleQueueAutoSolve, handleEntry } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

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

  const checkIsWrong = (character: string) => {
    const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === character)
    return character != "" && isAlreadyInUnit
  }

  const handleCharacterEntry = (character: string) => {
    setIsWrong(false)
    const replacementChar = character < "1" || character > "9" ? "" : character
    if (puzzleStringCurrent[gridSquareIndex] == replacementChar) return
    setLocalShownValue(replacementChar)
    if (checkIsWrong(replacementChar)) {
      setIsWrong(true)
      return
    }
    handleEntry(gridSquareIndex, replacementChar)
    entryRef.current?.blur()
    handleQueueAutoSolve(true)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    console.log("wow")

    if (!isLocked) {
      if (candidateMode) {
        console.log(e.pointerType)
        return
      }
      if (entryRef.current !== document.activeElement) {
        entryRef.current?.focus()
      } else {
        if (highlightN != 0 && !isWrong) {
          handleCharacterEntry(highlightN.toString())
        } else (document.activeElement as HTMLElement)?.blur()
      }
    } else (document.activeElement as HTMLElement)?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLocked) {
      handleCharacterEntry(e.key)
    }
  }
  const handleBlur = () => {
    if (isWrong) {
      handleCharacterEntry("0")
    }
  }

  const entryClassName = classNames({
    highlight: shownValue === highlightN.toString(),
    wrong: isWrong,
    "candidate-mode": candidateMode,
    set: isLocked
  })

  return (
    <div
      ref={entryRef}
      className={`entry ${entryClassName}`}
      tabIndex={isLocked ? -1 : gridSquareIndex + 1}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {localShownValue}
    </div>
  )
}

export default Entry
