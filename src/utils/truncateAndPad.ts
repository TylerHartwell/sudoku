const truncateAndPad = (inputString: string, targetStringLength: number, padCharacter: string, excludedChars: string[]) => {
  if (!Number.isInteger(targetStringLength) || targetStringLength <= 0) {
    throw new Error("targetStringLength must be an integer greater than 0")
  }

  if (padCharacter.length !== 1 || excludedChars.includes(padCharacter)) {
    throw new Error(`padCharacter must be a single character except for: ${excludedChars.join(", ")}`)
  }

  return inputString.slice(0, targetStringLength).padEnd(targetStringLength, padCharacter)
}

export default truncateAndPad
