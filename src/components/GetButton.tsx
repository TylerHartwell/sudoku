"use client"

const GetButton = () => {
  const handleClick = async () => {
    try {
      const response = await fetch("/api/randomPuzzle")

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      console.log("PAGE DATA: ", data)
    } catch (error) {
      console.log("PAGE ERROR: ", error)
    }
  }

  return <button onClick={handleClick}>GET TEST</button>
}

export default GetButton
