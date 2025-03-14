import { Difficulty } from "@/hooks/useSudokuManagement"
import clsx from "clsx"
import { ChangeEventHandler } from "react"

interface Props {
  difficulty: Difficulty
  difficultyLevels: readonly Difficulty[]
  isHidden: boolean
  onChange: ChangeEventHandler<HTMLSelectElement>
}

const DifficultySelector = ({
  difficulty,
  difficultyLevels,
  isHidden,
  onChange,
}: Props) => {
  return (
    <select
      name={"difficulty"}
      className={clsx("m-1 h-min w-min py-0.5", isHidden && "hidden")}
      value={difficulty}
      onChange={onChange}
    >
      {difficultyLevels.map((level) => (
        <option key={level} value={level} className="bg-primary">
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </option>
      ))}
    </select>
  )
}

export default DifficultySelector
