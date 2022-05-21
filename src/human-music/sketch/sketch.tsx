import $ from "jquery"
import React, { useReducer } from "react"
import { P5Instance, ReactP5Wrapper, SketchProps } from "react-p5-wrapper"
import { debounce } from "ts-debounce"
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D"
import { createAutomataSketch } from "../cellular-automata/automata-sketch"
import { Player } from "../performers/audio/player"
import { Painter } from "../performers/graphics/painter"
import SketchProvider from "./sketch-provider"

let automata: CellularAutomata1D | null
let automataPlayer: Player | null

const sketch = createAutomataSketch({
   bpm: 60,

   onSetup: (p5: P5Instance) => {
      p5.createCanvas($("#sketch").width()!, $("#sketch").height()!)
      p5.background(9, 9, 9)
   },

   onStep: () => {
      automata?.evolve()
      automataPlayer?.play()
   },

   onUpdateProps: (p5: P5Instance, props: SketchProps) => {
      p5.resizeCanvas($("#sketch").width()!, $("#sketch").height()!)
      if (props.newAutomata) {
         p5.background(9, 9, 9)
         automataPlayer?.stop()
         automata = props.newAutomata as CellularAutomata1D
         automataPlayer = new Player.Builder().withAutomata(automata).build()
         const automataPainter = new Painter.Builder().withSketch(p5).withAutomata(automata).build()
         automataPainter.draw()
      }
   },
})

export default function CellularAutomataSketch() {
   const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)

   React.useEffect(() => {
      const debounced = debounce(() => forceUpdate(), 200)
      const handleResize = () => debounced()
      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
   }, [])

   return (
      <SketchProvider.Consumer>
         {(newAutomata) => (
            <div className="CellularAutomataSketch" id="sketch">
               <ReactP5Wrapper customClass="canvas" sketch={sketch} newAutomata={newAutomata} ignored={ignored} />
            </div>
         )}
      </SketchProvider.Consumer>
   )
}
