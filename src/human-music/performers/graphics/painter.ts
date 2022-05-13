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
   private step = 0
   draw() {
      this.sketch.background(255, 0, 0)

      for (let y = 0; y < this.automata.size; y++) {
         for (let x = 0; x < this.automata.size; x++) {
            this.sketch.fill(colors[this.automata.state[x]])
            this.sketch.noStroke()
            this.sketch.rect(Math.ceil(x * this.cellSize), Math.ceil(y * this.cellSize), Math.ceil(this.cellSize), Math.ceil(this.cellSize))
         }
         this.automata.evolve()
      }

      this.automata.reset()
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

function melody(pattern: number[], x: number, factor: number, offset: number) {
   return pattern[Math.round(x * (factor + 1)) % pattern.length] + offset
}

const wave = [0, 1, 2, 3, 2, 1]
const wav2 = [0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 0, 1, 2, 2, 1, 0, 1]
const wave3 = [0, 2, 0, 2, 1, 0, 1, 2, 0, 2, 0, 2, 0, 2, 1, 0, 1, 2, 0, 2, 0, 2, 0, 2, 1, 0, 1, 2, 0, 2]

const up = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2]
const up2 = [0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 1]
const up3 = [0, 1, 2, 0, 2, 0, 1, 2, 0, 2, 0, 1, 2, 0, 2, 0, 1, 2, 0, 2, 0, 1, 2, 0, 2, 0, 1, 2, 0, 2]

const down = [2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0]
const down2 = [2, 1, 0, 2, 1, 2, 1, 0, 2, 1, 2, 1, 0, 2, 1, 2, 1, 0, 2, 1, 2, 1, 0, 2, 1, 2, 1, 0, 2, 1]
const down3 = [2, 1, 0, 2, 0, 2, 1, 0, 2, 0, 2, 1, 0, 2, 0, 2, 1, 0, 2, 0, 2, 1, 0, 2, 0, 2, 1, 0, 2, 0]

const zigzag = [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2]
const zigzag2 = [0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1]
const zigzag3 = [0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0]
