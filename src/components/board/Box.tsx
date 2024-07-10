import Square from "./Square"

const Box = ({ boxId }: { boxId: number }) => {
  return (
    <div className="box">
      {Array.from({ length: 9 }).map((_, index) => (
        <Square key={index} boxId={boxId} squareN={index + 1} />
      ))}
    </div>
  )
}

export default Box
