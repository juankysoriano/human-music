import p5 from "p5"
import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"

const colors = ["#090909", "#ffffff", "#a71c1c", "#ff8400"]
export class Painter {
   private cellSize: number
   private sketch: p5
   private automata: CellularAutomata1D

   constructor(sketch: p5, automata: CellularAutomata1D) {
      this.sketch = sketch
      this.automata = automata
      this.cellSize = this.sketch.width / automata.size
   }

   draw() {
      this.sketch.background(255, 0, 0)
      this.automata.reset()
      for (let y = 0; y < this.automata.size; y++) {
         for (let x = 0; x < this.automata.size; x++) {
            this.sketch.fill(colors[this.automata.state[x]])
            this.sketch.noStroke()
            this.sketch.rect(Math.ceil(x * this.cellSize), Math.ceil(y * this.cellSize), Math.ceil(this.cellSize), Math.ceil(this.cellSize))
         }
         this.automata.evolve()
      }
   }

   static Builder = class {
      private sketch?: p5
      private automata?: CellularAutomata1D

      withSketch(sketch: p5) {
         this.sketch = sketch
         return this
      }

      withAutomata(automata: CellularAutomata1D) {
         this.automata = automata
         return this
      }

      build() {
         if (this.automata === null) {
            throw new Error("Must pass a cellular automata upon building")
         }
         if (this.sketch === null) {
            throw new Error("Must pass a p5 sketch upon building")
         }
         return new Painter(this.sketch!, this.automata!)
      }
   }
}