"use client"

import { useRef, useState, useContext, useEffect } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import classNames from "classnames"
import clsx from "clsx"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
}

const Entry = ({ gridSquareIndex, shownValue }: EntryProps) => {
  const shownValueRef = useRef(shownValue)
  const [localShownValue, setLocalShownValue] = useState(shownValue)
  const [isLocked, setIsLocked] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const {
    puzzleStringCurrent,
    candidateMode,
    boardIsSet,
    highlightN,
    handleQueueAutoSolve,
    handleEntry,
    toggleManualElimCandidate,
    manualElimCandidates
  } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

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

    if (!isLocked) {
      if (candidateMode && e.pointerType === "touch") {
        if (entryRef.current !== document.activeElement) {
          entryRef.current?.focus()
        } else {
          if (highlightN != 0) {
            const candidateIndex = highlightN - 1
            const candidateKey = `${gridSquareIndex}-${candidateIndex}`
            const candidateN = highlightN
            const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === candidateN.toString())

            const isEliminated = shownValue || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)
            const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)

            if (isToggleable) toggleManualElimCandidate(gridSquareIndex, candidateIndex)
          } else (document.activeElement as HTMLElement)?.blur()
        }
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

  return (
    <div
      ref={entryRef}
      className={clsx(
        "entry flex justify-center items-center size-full absolute text-[200%] cursor-default overflow-hidden focus:outline-none focus:border-[5px] focus:border-green-600",
        candidateMode && "no-hover-device:focus:border-red-500 hover-fine-device:pointer-events-none",
        !candidateMode && "hover-fine-device:hover:border-[1px] hover-fine-device:hover:border-[rgb(80,80,80)]",
        //equal priority focus styles follow after hover styles so they take precedence
        !candidateMode && "hover-fine-device:focus:border-[5px] hover-fine-device:focus:border-green-600",
        isLocked && "bg-[rgba(142,153,167,0.349)]",
        isWrong && "bg-red-500",
        shownValue === highlightN.toString() &&
          "[text-shadow:_-1px_-1px_0_currentColor,1px_-1px_0_currentColor,-1px_1px_0_currentColor,1px_1px_0_currentColor]"
      )}
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
