const createStateHandler =
  <T>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    options?: {
      //if modifier is provided, use the returned value of the modifier instead
      modifier?: (newValue: T) => T
      //if validator is provided and returns false, don't set state
      validator?: (newValue: T) => boolean
      //if sideEffect provided and state is set, run sideEffect
      sideEffect?: (newValue?: T) => void
    }
  ) =>
  (update: ((prev: T) => T) | T) => {
    let resolvedValue = typeof update !== "function" ? update : (update as (prev: T) => T)

    if (options?.modifier && typeof resolvedValue !== "function") {
      resolvedValue = options.modifier(resolvedValue)
    }

    if (!options?.validator || (typeof resolvedValue !== "function" && options.validator(resolvedValue))) {
      setter(resolvedValue)

      if (options?.sideEffect) {
        if (typeof resolvedValue !== "function") {
          options.sideEffect(resolvedValue)
        } else {
          options.sideEffect()
        }
      }
    }
  }

export default createStateHandler
