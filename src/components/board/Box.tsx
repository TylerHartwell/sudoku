import { ReactNode } from "react"
import Square from "./Square"

const Box = () => {
  return (
    <div className="box">
      {Array.from({ length: 9 }).map((_, index) => (
        <Square key={index} />
      ))}
    </div>
  )
}

export default Box
