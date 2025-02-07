import { getItem, setItem } from "@/utils/localStorage"
import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    return initialValue
  })

  useEffect(() => {
    const storedValue = getItem(key) as T
    if (storedValue !== undefined) {
      setValue(storedValue)
    }
  }, [])

  useEffect(() => {
    setItem(key, value)
  }, [value])

  return [value, setValue] as const
}
