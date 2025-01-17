"use client"

import { useRef, useState, useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import clsx from "clsx"
import isValidChar from "@/utils/isValidChar"
import { symbols } from "@/hooks/useSudokuManagement"

interface EntryProps {
  gridSquareIndex: number
  shownValue: string
}

const Entry = ({ gridSquareIndex, shownValue }: EntryProps) => {
  const [localShownValue, setLocalShownValue] = useState(shownValue)
  const {
    puzzleStringStart,
    puzzleStringCurrent,
    candidateMode,
    boardIsSet,
    highlightIndex,
    handleEntry,
    toggleManualElimCandidate,
    manualElimCandidates,
    isAlreadyInUnit,
    handleLastFocusedEntryIndex,
    padNumberClicked
  }: {
    puzzleStringStart: string
    puzzleStringCurrent: string
    candidateMode: boolean
    boardIsSet: boolean
    highlightIndex: number | null
    handleEntry: (i: number, s: string) => void
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => void
    manualElimCandidates: string[]
    isAlreadyInUnit: (gridSquareIndex: number, character: string, puzzleString: string) => boolean
    handleLastFocusedEntryIndex: (entryIndex: number | null) => void
    padNumberClicked: React.MutableRefObject<boolean>
  } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const isLocked = boardIsSet && puzzleStringStart.length == Math.pow(symbols.length, 2) && puzzleStringStart[gridSquareIndex] == shownValue
  const isWrong = isAlreadyInUnit(gridSquareIndex, localShownValue, puzzleStringCurrent)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (!isLocked) {
      if (candidateMode && e.pointerType === "touch") {
        if (entryRef.current !== document.activeElement) {
          entryRef.current?.focus()
        } else {
          if (highlightIndex != null) {
            const candidateIndex = highlightIndex
            const candidateKey = `${gridSquareIndex}-${candidateIndex}`
            const isAlreadyInUnit = getPeerGridSquareIndices(gridSquareIndex).some(i => puzzleStringCurrent[i] === symbols[highlightIndex])

            const isEliminated = shownValue || isAlreadyInUnit || manualElimCandidates.includes(candidateKey)
            const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)

            if (isToggleable) {
              toggleManualElimCandidate(gridSquareIndex, candidateIndex)
              ;(document.activeElement as HTMLElement)?.blur()
            }
          } else (document.activeElement as HTMLElement)?.blur()
        }
        return
      }
      if (entryRef.current !== document.activeElement) {
        entryRef.current?.focus()
      } else {
        if (highlightIndex != null && !isWrong) {
          handleEntry(gridSquareIndex, symbols[highlightIndex])
        } else (document.activeElement as HTMLElement)?.blur()
      }
    } else (document.activeElement as HTMLElement)?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    alert(e.key)
    if (!isLocked) {
      if (isValidChar(e.key) && e.key.toUpperCase() != localShownValue && puzzleStringCurrent[gridSquareIndex] != e.key.toUpperCase()) {
        setLocalShownValue(e.key.toUpperCase())
        handleEntry(gridSquareIndex, e.key.toUpperCase())
      } else {
        setLocalShownValue("")
        handleEntry(gridSquareIndex, "0")
      }
    }
  }

  const handleFocus = () => {
    handleLastFocusedEntryIndex(gridSquareIndex)
  }

  const handleBlur = () => {
    if (!padNumberClicked.current) {
      handleLastFocusedEntryIndex(null)
    }

    padNumberClicked.current = false

    if (isWrong) {
      setLocalShownValue("")
    }
  }

  const innerValue = isWrong ? localShownValue : shownValue
  const innerContent = innerValue == "" ? "" : innerValue

  return (
    <div
      ref={entryRef}
      className={clsx(
        "entry flex justify-center items-center size-full absolute text-[10vw] md:text-[clamp(10px,min(6vh,3vw),90px)] cursor-default focus:outline-none focus:border-[3px] focus:border-green-600 z-10",
        candidateMode && "focus:border-red-500 hover-fine-device:pointer-events-none",
        !candidateMode && "hover-fine-device:hover:border-[1px] hover-fine-device:hover:border-[rgb(80,80,80)]",
        //equal priority focus styles follow after hover styles so they take precedence
        !candidateMode && "hover-fine-device:focus:border-[3px] hover-fine-device:focus:border-green-600 ",
        isLocked && "bg-[rgba(142,153,167,0.349)]",
        isWrong && "bg-red-500",
        highlightIndex != null && shownValue === symbols[highlightIndex] && "font-bold"
      )}
      tabIndex={isLocked ? -1 : gridSquareIndex + 1}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {innerContent}
    </div>
  )
}

export default Entry
