const replaceNonDigitsWithZero = (str: string) => {
  return str.replace(/\D/g, "0")
}

export default replaceNonDigitsWithZero
