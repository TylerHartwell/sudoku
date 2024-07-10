"use client"

import { useRef, useState, useContext } from "react"
import CandidateContext from "@/contexts/CandidateContext"

const Entry = ({ boxId, squareN }: { boxId: number; squareN: number }) => {
  const [shownValue, setShownValue] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const { highlightCandidates, candidateMode } = useContext(CandidateContext)
  const entryRef = useRef<HTMLDivElement>(null)

  const noPointer: string = candidateMode ? "no-pointer" : ""

  const handleClick = () => {
    if (entryRef.current) {
      entryRef.current.focus()
      console.log(entryRef)
    }
  }

  return (
    <div ref={entryRef} className={`entry ${noPointer}`} tabIndex={0} onClick={handleClick} contentEditable={true}>
      {shownValue}
    </div>
  )
}

export default Entry
