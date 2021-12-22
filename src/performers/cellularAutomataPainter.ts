import p5 from 'p5';
import { off } from 'process';
import { CellularAutomata1D } from '../cellular-automata';

const colors = [
    ['#09090935', '#fae2b735', '#49719d35'],
    ['#000000', '#ff5789', '#e8b354'],
    ['#000000', '#49719d', '#e8b354'],
    ['#000000', '#c23b22', '#e8b354'],
    ['#000000', '#e8b354', '#49719d'],
    ['#000000', '#fae2b7', '#d62828']
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
            this.sketch.noFill();
            this.sketch.stroke(colors[0][this.automata.state[i]]);
            for (let lines = 0; lines < 32 / window.devicePixelRatio; lines++) {
                this.sketch.line(
                    this.cellSize * i + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize),
                    this.cellSize * this.step + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize), 
                    this.cellSize * i + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize), 
                    this.cellSize * this.step + this.cellSize / 2 + (Math.random() * 2 * this.cellSize - this.cellSize));
            }
        }

        if (this.step * this.cellSize >= this.sketch.height) {
            this.sketch.background(9, 9, 9, 235);
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