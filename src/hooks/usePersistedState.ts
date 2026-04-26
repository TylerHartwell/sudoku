import { getItem, setItem } from "@/utils/localStorage"
import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, initialValue: T) {
  // Start from the same value on server and client to avoid hydration mismatches.
  const [value, setValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedValue = getItem<T>(key)
      if (storedValue !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(storedValue)
      }
    } catch (error) {
      console.error(`❌ Error reading localStorage key "${key}":`, error)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  useEffect(() => {
    if (isLoading) return

    try {
      const storedValue = getItem<T>(key)
      if (storedValue !== value) {
        setItem(key, value)
      }
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error)
    }
  }, [isLoading, key, value])

  return [value, setValue, isLoading] as const
}
