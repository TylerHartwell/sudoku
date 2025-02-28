//given a string and array of characters, return an object where the keys are the characters from the array and the values are the count of the corresponding character in the string
function getCountOfCharactersInStringFromArray(str: string, charArray: string[]) {
  const result = Object.fromEntries(charArray.map(char => [char, 0]))

  for (const char of str) {
    if (char in result) {
      result[char]++
    }
  }

  return result
}

export default getCountOfCharactersInStringFromArray
