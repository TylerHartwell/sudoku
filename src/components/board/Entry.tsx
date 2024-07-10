"use client"

import { useState } from "react"

const Entry = ({ boxId, squareN }: { boxId: number; squareN: number }) => {
  const [shownValue, setShownValue] = useState("")
  const [isLocked, setIsLocked] = useState(false)

  return (
    <div className="entry" contentEditable={!isLocked} tabIndex={-1}>
      {shownValue}
    </div>
  )
}

export default Entry
