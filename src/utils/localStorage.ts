export function setItem<T>(key: string, value: T) {
  try {
    if (typeof value === "function") {
      throw new Error("Cannot store functions in localStorage")
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`❌ Error setting localStorage key "${key}":`, error)
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : null
  } catch (error) {
    console.error(`❌ Error parsing localStorage key "${key}":`, error)
    return null
  }
}
