import p5 from 'p5';
import { CellularAutomata1D } from '../cellular-automata';

const colors = ['#00000000', '#e8b354', '#568140']

export class CellularAutomata1DPainter {
    private step: number = 0;
    private cellSize: number;
    private sketch: p5;
    private automata: CellularAutomata1D;

    constructor(sketch: p5, automata: CellularAutomata1D) {
        this.sketch = sketch;
        this.automata = automata;
        this.cellSize = this.sketch.width / automata.size
    }
    
    draw() {
        for (let i = 0; i < this.automata.size; i++) {
            this.sketch.noStroke();
            this.sketch.fill(colors[this.automata.state[i]]);
            this.sketch.rect(this.cellSize * i, this.step * this.cellSize, this.cellSize, this.cellSize);
        }

        if (this.step * this.cellSize >= this.sketch.height) {
            this.sketch.background(0, 0, 0, 235);
            this.step = 0;
        } else {
            this.step++;
        }
    }

    static Builder = class {
        private sketch?: p5;
        private automata?: CellularAutomata1D;

        withSketch(sketch: p5) {
            this.sketch = sketch;
            return this;
        }

        withAutomata(automata: CellularAutomata1D) {
            this.automata = automata;
            return this;
        }

        build() {
            if (this.automata === null) {
                throw new Error("Must pass a cellular automata upon building");
            }
            if (this.sketch === null) {
                throw new Error("Must pass a p5 sketch upon building");
            }
            return new CellularAutomata1DPainter(this.sketch!, this.automata!);
        }
    }
}