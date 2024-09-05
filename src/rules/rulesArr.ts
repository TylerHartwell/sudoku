import intersectionRemoval from "./intersectionRemoval"
import nakedSingle from "./nakedSingle"
import nakedPairs from "./nakedPairs"
import hiddenSingle from "./hiddenSingle"
import { Rule } from "./rulesInterface"
import nakedTriple from "./nakedTriple"

// const rulesArr = ["Lone Single", "Naked Single", "Intersection Removal", "Naked Pairs"]
const rulesArr: Rule[] = [nakedSingle, hiddenSingle, intersectionRemoval, nakedPairs, nakedTriple]

export default rulesArr
