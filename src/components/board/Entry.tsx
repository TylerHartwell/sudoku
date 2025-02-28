"use client"

import { useRef, RefObject, useEffect } from "react"
import clsx from "clsx"
import isValidChar from "@/utils/isValidChar"

interface Props {
  gridSquareIndex: number
  shownValue: string
  puzzleStringStart: string
  puzzleStringCurrent: string
  isCandidateMode: boolean
  isBoardSet: boolean
  highlightIndex: number | null
  handleEntry: (i: number, s: string) => void
  manualElimCandidates: string[]
  isAlreadyInUnit: (gridSquareIndex: number, character: string, puzzleString: string) => boolean
  handleLastFocusedEntryIndex: (entryIndex: number | null) => void
  padNumberClicked: RefObject<boolean>
  handleShouldAutoSolve: (beQueued: boolean) => void
  lastFocusedEntryIndex: number | null
  toggleCandidateQueueSolveOnElim: (gridSquareIndex: number, candidateIndex: number) => void
  sortedEntries: (Element | null)[]
  symbols: string[]
  symbolsLength: number
  entryDivRefs: RefObject<(HTMLDivElement | null)[]>
}

const Entry = ({
  gridSquareIndex,
  shownValue,
  puzzleStringStart,
  puzzleStringCurrent,
  isCandidateMode,
  isBoardSet,
  highlightIndex,
  handleEntry,
  manualElimCandidates,
  isAlreadyInUnit,
  handleLastFocusedEntryIndex,
  padNumberClicked,
  handleShouldAutoSolve,
  lastFocusedEntryIndex,
  toggleCandidateQueueSolveOnElim,
  sortedEntries,
  symbols,
  symbolsLength,
  entryDivRefs
}: Props) => {
  useEffect(() => {}, [])

  const isLocked = isBoardSet && puzzleStringStart.length == Math.pow(symbolsLength, 2) && puzzleStringStart[gridSquareIndex] == shownValue
  const isWrong = isAlreadyInUnit(gridSquareIndex, shownValue, puzzleStringCurrent)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    console.log(entryDivRefs.current[gridSquareIndex])
    if (!isLocked) {
      if (isCandidateMode && e.pointerType === "touch") {
        if (entryDivRefs.current[gridSquareIndex] !== document.activeElement) {
          entryDivRefs.current[gridSquareIndex]?.focus()
        } else {
          if (highlightIndex != null) {
            const candidateIndex = highlightIndex
            const candidateKey = `${gridSquareIndex}-${candidateIndex}`

            const isEliminated =
              shownValue ||
              isAlreadyInUnit(gridSquareIndex, symbols[highlightIndex], puzzleStringCurrent) ||
              manualElimCandidates.includes(candidateKey)
            const isToggleable = !isEliminated || manualElimCandidates.includes(candidateKey)

            if (isToggleable) {
              toggleCandidateQueueSolveOnElim(gridSquareIndex, candidateIndex)
              ;(document.activeElement as HTMLElement)?.blur()
            }
          } else {
            ;(document.activeElement as HTMLElement)?.blur()
          }
        }
        return
      }
      if (entryDivRefs.current[gridSquareIndex] !== document.activeElement) {
        entryDivRefs.current[gridSquareIndex]?.focus()
      } else {
        if (highlightIndex !== null) {
          if (highlightIndex == symbols.indexOf(shownValue)) {
            handleEntry(gridSquareIndex, "0")
          } else {
            handleEntry(gridSquareIndex, symbols[highlightIndex])
            if (!isAlreadyInUnit(gridSquareIndex, symbols[highlightIndex], puzzleStringCurrent)) {
              if (document.activeElement) {
                ;(document.activeElement as HTMLElement)?.blur()
              }

              handleShouldAutoSolve(true)
            }
          }
        }
      }
    } else {
      ;(document.activeElement as HTMLElement)?.blur()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const entries = sortedEntries as HTMLElement[]
      const currentIndex = entries.findIndex(el => el === document.activeElement)

      if (currentIndex !== -1) {
        e.preventDefault()
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1

        if (nextIndex >= 0 && nextIndex < entries.length) {
          entries[nextIndex].focus()
        } else {
          e.currentTarget.blur()
        }
      }

      return
    }

    if (e.key.length > 1 && e.key !== " ") {
      return
    }

    if (!isLocked) {
      if (isValidChar(e.key, symbols) && e.key.toUpperCase() != shownValue) {
        if (!isAlreadyInUnit(gridSquareIndex, e.key.toUpperCase(), puzzleStringCurrent)) {
          ;(document.activeElement as HTMLElement)?.blur()
          handleShouldAutoSolve(true)
        }
        handleEntry(gridSquareIndex, e.key.toUpperCase())
      } else if (e.key === " " || e.key === "0" || e.key.toUpperCase() == shownValue) {
        handleEntry(gridSquareIndex, "0")
      }
    }
  }

  const handleFocus = () => {
    handleLastFocusedEntryIndex(gridSquareIndex)
  }

  const handleBlur = () => {
    if (!padNumberClicked.current) {
      if (isAlreadyInUnit(gridSquareIndex, shownValue, puzzleStringCurrent) && gridSquareIndex == lastFocusedEntryIndex) {
        handleEntry(gridSquareIndex, "0")
      }
      handleLastFocusedEntryIndex(null)
    } else {
      ;(document.activeElement as HTMLElement)?.blur()
      handleLastFocusedEntryIndex(null)
    }
    padNumberClicked.current = false
  }

  return (
    <div
      ref={el => {
        entryDivRefs.current[gridSquareIndex] = el
      }}
      className={clsx(
        "flex justify-center items-center size-full absolute text-[10vw] md:text-[clamp(10px,min(6vh,3vw),90px)] cursor-default hover:border hover:border-[rgb(80,80,80)] focus:outline-hidden focus:border-[3px] focus:border-green-600 z-10",
        isCandidateMode && "focus:border-red-500 hover:border-none",
        isLocked && "bg-[rgba(142,153,167,0.349)]",
        isWrong && "bg-red-500",
        highlightIndex != null && shownValue === symbols[highlightIndex] && "font-bold"
      )}
      data-grid-square-index={gridSquareIndex}
      data-shown-value={shownValue}
      data-entry
      tabIndex={isLocked ? -1 : 0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {shownValue}
    </div>
  )
}

export default Entry
