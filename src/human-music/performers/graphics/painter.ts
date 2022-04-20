import p5 from "p5"
import { CellularAutomata1D } from "../../cellular-automata/1d/cellularAutomata1D"

const colors = ["#090909", "#ffffff", "#a71c1c", "#bfb2bf"]

export class Painter {
   private step: number = 0
   private cellSize: number
   private sketch: p5
   private automata: CellularAutomata1D

   constructor(sketch: p5, automata: CellularAutomata1D) {
      this.sketch = sketch
      this.automata = automata
      this.cellSize = this.sketch.width / automata.size
   }

   draw() {
      for (let i = 0; i < this.automata.size; i++) {
         this.sketch.fill(colors[this.automata.state[i]])
         this.sketch.noStroke()
         this.sketch.rect(
            Math.ceil(i * this.cellSize),
            Math.ceil(this.step * this.cellSize),
            Math.ceil(this.cellSize),
            Math.ceil(this.cellSize * 0.0625)
         )
      }

      if (this.step * this.cellSize >= this.sketch.height) {
         this.sketch.background(9, 9, 9, 235)
         this.step = 0
      } else {
         this.step += 0.0625
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
