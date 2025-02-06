import "../css/modern-normalize.css"

export default function Sandbox() {
  return (
    <div className="main h-max flex flex-col items-center overflow-y-auto min-w-fit w-auto">
      <h1 className="w-full title max-w-[1000px] text-center text-[2em] h-[40px]">title</h1>
      <div className=" bounder bg-green-300 flex flex-row-reverse justify-center">
        <div className="playground bg-sky-600 flex flex-col ">
          <div className="board w-[max(min(60vw,calc(100vh-80px)),300px)] aspect-square text-center content-center">board</div>
          <div className=" w-[max(min(60vw,calc(100vh-80px)),300px)] min-h-[40px] grow content-center bg-yellow-300 text-center">numberpad</div>
        </div>
        <div className="rules bg-stone-300 w-auto max-w-[40%] min-w-fit content-center overflow-auto">This has some stuff that should work</div>
      </div>
    </div>
  )
}
