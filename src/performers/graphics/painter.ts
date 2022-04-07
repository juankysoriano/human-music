import p5 from 'p5';
import { CellularAutomata1D } from '../../cellular-automata';

const colors = ['#09090935', '#ffffff35', '#a71c1c35'];

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
            this.sketch.noFill()
            this.sketch.stroke(colors[this.automata.state[i]])
            for (let lines = 0; lines < 25 / window.devicePixelRatio; lines++) {
                this.sketch.line(
                    this.cellSize * i + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize),
                    this.cellSize * this.step + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize),
                    this.cellSize * i + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize),
                    this.cellSize * this.step + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize))
            }
        }

        if (this.step * this.cellSize >= this.sketch.height) {
            this.sketch.background(9, 9, 9, 235)
            this.step = 0
        } else {
            this.step++
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