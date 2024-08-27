import Square from "./Square"

const Box = ({ boxIndex }: { boxIndex: number }) => {
  return (
    <div className="box">
      {Array.from({ length: 9 }).map((_, index) => (
        <Square key={index} boxIndex={boxIndex} boxSquareIndex={index} />
      ))}
    </div>
  )
}

export default Box
