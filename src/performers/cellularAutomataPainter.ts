import p5 from 'p5';
import { off } from 'process';
import { CellularAutomata1D } from '../cellular-automata';

const colors = [
    ['#000000', '#e8b354', '#c23b22'],
    ['#000000', '#fbe4d1', '#93ab8f'],
    ['#000000', '#2000ff', '#ff68a3'],
    ['#000000', '#fbf9f4', '#97e1ff'],
    ['#000000', '#ff4950', '#ffbeea'],
    ['#000000', '#ae4f2f', '#507844']
];

export class CellularAutomata1DPainter {
    private step: number = 0;
    private cellSize: number;
    private sketch: p5;
    private automata: CellularAutomata1D;
    private offset: number;

    constructor(sketch: p5, automata: CellularAutomata1D, offset: number) {
        this.sketch = sketch;
        this.automata = automata;
        this.cellSize = this.sketch.width / automata.size;
        this.offset = offset;
    }

    draw() {
        for (let i = 0; i < this.automata.size; i++) {
            this.sketch.noStroke();
            this.sketch.fill(colors[this.offset][this.automata.state[i]]);
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
        private offset = 0;

        withSketch(sketch: p5) {
            this.sketch = sketch;
            return this;
        }

        withAutomata(automata: CellularAutomata1D) {
            this.automata = automata;
            return this;
        }

        withOffset(offset: number) {
            this.offset = offset;
            return this;
        }

        build() {
            if (this.automata === null) {
                throw new Error("Must pass a cellular automata upon building");
            }
            if (this.sketch === null) {
                throw new Error("Must pass a p5 sketch upon building");
            }
            return new CellularAutomata1DPainter(this.sketch!, this.automata!, this.offset);
        }
    }
}