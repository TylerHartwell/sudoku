import clsx from "clsx"
import { ChangeEventHandler } from "react"

interface Props<T extends string> {
  difficulty: T
  difficultyLevels: readonly T[]
  isHidden: boolean
  onChange: ChangeEventHandler<HTMLSelectElement>
}

const DifficultySelector = <T extends string>({ difficulty, difficultyLevels, isHidden, onChange }: Props<T>) => {
  return (
    <select name={"difficulty"} className={clsx("difficulty m-1 py-0.5 h-min w-min", isHidden && "hidden")} value={difficulty} onChange={onChange}>
      {difficultyLevels.map(level => (
        <option key={level} value={level}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </option>
      ))}
    </select>
  )
}

export default DifficultySelector
