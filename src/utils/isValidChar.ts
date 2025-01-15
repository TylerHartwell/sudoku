import { symbols } from "@/hooks/useSudokuManagement"

export default function isValidChar(sampleChar: string) {
  return symbols.includes(sampleChar)
}
