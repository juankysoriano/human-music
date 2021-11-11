import p5 from 'p5';
import { CellularAutomata1D } from './cellularAutomata1D';

export class CellularAutomata1DPainter {
    private step: number = 0;
    private cellSize: number;
    private sketch: p5;
    private automata: CellularAutomata1D;

    constructor(sketch: p5, automata: CellularAutomata1D) {
        this.sketch = sketch;
        this.automata = automata;
        this.cellSize = sketch.width / automata.size;
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

    setup() {
        this.sketch.noStroke();
    }

    draw() {
        for (let i = 0; i < this.automata.size; i++) {
            this.setFillColor(this.automata.state[i]);
            this.sketch.rect(this.cellSize*i, this.step*this.cellSize, this.cellSize, this.cellSize);

        }
        this.step++;
    }

    private setFillColor(state: number) {
        if (state === 0) {
            this.sketch.fill('#000000');
        } else if (state === 1) {
            this.sketch.fill('#F36E44');
        } else if (state === 2) {
            this.sketch.fill('#568140');
        }
    }

}