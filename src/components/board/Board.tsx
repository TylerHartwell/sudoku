import Box from "./Box"

const Board = () => {
  return (
    <section className="board">
      {Array.from({ length: 9 }).map((_, index) => (
        <Box key={index} boxIndex={index} />
      ))}
    </section>
  )
}

export default Board
