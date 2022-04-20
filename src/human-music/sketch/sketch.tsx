import $ from "jquery"
import React, { useReducer } from "react"
import { P5Instance, ReactP5Wrapper, Sketch } from "react-p5-wrapper"
import { debounce } from "ts-debounce"
import { CellularAutomata1D } from "../cellular-automata/1d/cellularAutomata1D"
import { Player } from "../performers/audio/player"
import { Painter } from "../performers/graphics/painter"
import SketchProvider from "./SketchProvider"

let automata: CellularAutomata1D | null
let automataPainter: Painter | null
let automataPlayer: Player | null
let counter = 0

const sketch: Sketch = (p5) => {
   p5.noLoop()

   setInterval(() => p5.draw(), 1000 / 64)

   p5.setup = () => {
      p5.createCanvas($("#sketch").width()!, $("#sketch").height()!)
      p5.background(9, 9, 9)
   }

   p5.updateWithProps = (props) => {
      p5.resizeCanvas($("#sketch").width()!, $("#sketch").height()!)
      if (props.newAutomata) {
         p5.background(9, 9, 9)
         updateSketch(p5, props.newAutomata as CellularAutomata1D)
      }
   }

   p5.draw = async () => {
      if (automata) {
         automataPainter?.draw()
         if (counter % 16 === 0 && counter > 0) {
            automata?.evolve()
            automataPlayer?.play()
         }
         counter++
      }
   }
}

async function updateSketch(p5: P5Instance, newAutomata: CellularAutomata1D) {
   automataPlayer?.stop()
   automata = null
   automataPainter = null
   automataPlayer = null

   setTimeout(() => {
      automata = newAutomata
      automataPainter = new Painter.Builder().withSketch(p5).withAutomata(newAutomata).build()
      automataPlayer = new Player.Builder().withAutomata(automata).build()
      counter = 0
   }, 250)
}

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
