import intersectionRemoval from "./intersectionRemoval"
import loneSingle from "./loneSingle"
import nakedSingle from "./nakedSingle"
import { Rule } from "./rulesInterface"

// const rulesArr = ["Lone Single", "Naked Single", "Intersection Removal", "Naked Pairs"]
const rulesArr: Rule[] = [loneSingle, nakedSingle, intersectionRemoval]

export default rulesArr
