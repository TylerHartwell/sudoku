"use client"

import { useRef, useState, useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"
import getPeerGridSquareIndices from "@/utils/getPeerGridSquareIndices"
import clsx from "clsx"
import isValidChar from "@/utils/isValidChar"

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
    highlightN,
    handleEntry,
    toggleManualElimCandidate,
    manualElimCandidates,
    isAlreadyInUnit
  }: {
    puzzleStringStart: string
    puzzleStringCurrent: string
    candidateMode: boolean
    boardIsSet: boolean
    highlightN: number
    handleEntry: (i: number, s: string) => void
    toggleManualElimCandidate: (gridSquareIndex: number, candidateIndex: number, shouldManualElim?: boolean) => void
    manualElimCandidates: string[]
    isAlreadyInUnit: (gridSquareIndex: number, character: string, puzzleString: string) => boolean
  } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const isLocked = boardIsSet && puzzleStringStart.length == 81 && puzzleStringStart[gridSquareIndex] == shownValue
  const isWrong = isAlreadyInUnit(gridSquareIndex, localShownValue, puzzleStringCurrent)

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
          console.log(gridSquareIndex, highlightN.toString())
          handleEntry(gridSquareIndex, highlightN.toString())
        } else (document.activeElement as HTMLElement)?.blur()
      }
    } else (document.activeElement as HTMLElement)?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLocked) {
      setLocalShownValue(isValidChar(e.key) && e.key != localShownValue ? e.key : "")
      if (e.key != localShownValue) {
        handleEntry(gridSquareIndex, e.key)
      }
    }
  }

  const handleBlur = () => {
    if (isWrong) {
      setLocalShownValue("")
    }
  }

  return (
    <div
      ref={entryRef}
      className={clsx(
        "entry flex justify-center items-center size-full absolute  text-[10vw] md:text-[clamp(25px,min(6vh,3vw),90px)] cursor-default focus:outline-none focus:border-[3px] focus:border-green-600 z-10",
        candidateMode && "focus:border-red-500 hover-fine-device:pointer-events-none",
        !candidateMode && "hover-fine-device:hover:border-[1px] hover-fine-device:hover:border-[rgb(80,80,80)]",
        //equal priority focus styles follow after hover styles so they take precedence
        !candidateMode && "hover-fine-device:focus:border-[3px] hover-fine-device:focus:border-green-600 ",
        isLocked && "bg-[rgba(142,153,167,0.349)]",
        isWrong && "bg-red-500",
        shownValue === highlightN.toString() && "font-bold"
      )}
      tabIndex={isLocked ? -1 : gridSquareIndex + 1}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {isWrong ? localShownValue : shownValue}
    </div>
  )
}

export default Entry
