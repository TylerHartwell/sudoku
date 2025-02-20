import { getItem, setItem } from "@/utils/localStorage"
import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedValue = getItem<T>(key)
      if (storedValue !== null) {
        setValue(storedValue)
      }
      setIsLoading(false)
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error)
    }
  }, [])

  useEffect(() => {
    try {
      const storedValue = getItem<T>(key)
      if (storedValue !== value) {
        setItem(key, value)
      }
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error)
    }
  }, [value])

  return [value, setValue, isLoading] as const
}
