function getValidSymbols(symbols: any[]) {
  if (!Array.isArray(symbols)) {
    throw new Error("Input must be an array.")
  }

  for (const symbol of symbols) {
    if (symbol === "" || symbol === "0" || symbol === null || symbol === undefined || typeof symbol === "boolean") {
      throw new Error(`Invalid symbol found: ${symbol}`)
    }
  }

  const firstType = typeof symbols[0]
  if (!symbols.every(symbol => typeof symbol === firstType)) {
    throw new Error("All symbols must be of the same type.")
  }

  const uniqueSymbols = new Set(symbols)
  if (uniqueSymbols.size !== symbols.length) {
    throw new Error("All symbols must be unique.")
  }

  const sqrt = Math.sqrt(symbols.length)
  if (!Number.isInteger(sqrt) || sqrt < 2 || sqrt > 4) {
    throw new Error("The number of symbols has to be the square of 2, 3, or 4")
  }

  return symbols
}

export default getValidSymbols
