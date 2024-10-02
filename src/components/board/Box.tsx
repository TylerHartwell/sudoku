import Square from "./Square"

const Box = ({ boxIndex }: { boxIndex: number }) => {
  return (
    <div className="box grid place-items-center grid-cols-[1fr_1fr_1fr] grid-rows-[1fr_1fr_1fr] border-[1px] border-black aspect-square">
      {Array.from({ length: 9 }).map((_, index) => (
        <Square key={index} boxIndex={boxIndex} boxSquareIndex={index} />
      ))}
    </div>
  )
}

export default Box
