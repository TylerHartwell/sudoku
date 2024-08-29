import intersectionRemoval from "./intersectionRemoval"
import nakedSingle from "./nakedSingle"
import nakedPairs from "./nakedPairs"
import hiddenSingle from "./hiddenSingle"
import { Rule } from "./rulesInterface"

// const rulesArr = ["Lone Single", "Naked Single", "Intersection Removal", "Naked Pairs"]
const rulesArr: Rule[] = [nakedSingle, hiddenSingle, intersectionRemoval, nakedPairs]

export default rulesArr
